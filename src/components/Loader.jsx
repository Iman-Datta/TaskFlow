import { useEffect, useState, useRef } from "react";

const STEPS = [
  {
    at: 0,
    pct: 0,
    label: "Starting up",
    msg: "Just a moment while we set things up.",
  },
  {
    at: 12,
    pct: 22,
    label: "Loading files",
    msg: "Fetching everything you need.",
  },
  {
    at: 28,
    pct: 42,
    label: "Checking settings",
    msg: "Making sure it's just right for you.",
  },
  { at: 48, pct: 65, label: "Almost there", msg: "We're in the home stretch!" },
  {
    at: 68,
    pct: 80,
    label: "Finalising",
    msg: "Tying up the last few things…",
  },
];

const TITLES = [
  "Getting things ready…",
  "Loading your files…",
  "Checking your settings…",
  "Almost ready!",
  "Just finishing up…",
];

function fakeBackendCall(delay = 5200) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [msgVisible, setMsgVisible] = useState(true);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // All mutable state in refs so interval closure never goes stale
  const tickRef = useRef(0);
  const progressRef = useRef(0);
  const stepIdxRef = useRef(0);
  const backendDone = useRef(false);
  const finishingRef = useRef(false);
  const intervalRef = useRef(null);

  function smoothSetProgress(target) {
    progressRef.current = target;
    setProgress(Math.round(target));
  }

  function changeStep(idx) {
    stepIdxRef.current = idx;
    setStepIdx(idx);
    setMsgVisible(false);
    setTimeout(() => setMsgVisible(true), 200);
  }

  function finishUp() {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setIsFinishing(true);
    clearInterval(intervalRef.current);

    // Show final step
    stepIdxRef.current = 4;
    setStepIdx(4);
    setMsgVisible(false);
    setTimeout(() => setMsgVisible(true), 200);

    // Rush from current position → 100%
    const rush = setInterval(() => {
      const next = Math.min(100, progressRef.current + 3);
      smoothSetProgress(next);
      if (next >= 100) {
        clearInterval(rush);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 600);
        }, 400);
      }
    }, 25);
  }

  useEffect(() => {
    // Replace fakeBackendCall with your real API call
    fakeBackendCall(5200).then(() => {
      backendDone.current = true;
    });

    intervalRef.current = setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;

      // Determine current step from tick
      const nextStepIdx = STEPS.reduce((acc, s, i) => (t >= s.at ? i : acc), 0);
      if (nextStepIdx !== stepIdxRef.current) {
        changeStep(nextStepIdx);
      }

      // Soft cap: bar won't cross into the next step's range until backend fires
      const currentStep = STEPS[nextStepIdx];
      const nextStep = STEPS[nextStepIdx + 1];
      const softCap = backendDone.current
        ? 100
        : nextStep
          ? nextStep.pct - 3
          : 78;
      const natural = currentStep.pct + Math.min(t - currentStep.at, 10) * 1.2;
      const newPct = Math.min(natural, softCap);

      if (newPct > progressRef.current) {
        smoothSetProgress(newPct);
      }

      // Backend done + we're past 60% → rush to 100%
      if (
        backendDone.current &&
        progressRef.current >= 60 &&
        !finishingRef.current
      ) {
        finishUp();
      }
    }, 350);

    return () => clearInterval(intervalRef.current);
  }, []); // empty — interval reads from refs only, never stale

  if (done) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f4f0",
        fontFamily: "'DM Sans', sans-serif",
        transition: "opacity 0.6s ease",
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          width: "100%",
          maxWidth: 360,
          padding: "0 24px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            marginBottom: 28,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SpinIcon progress={progress} />
        </div>

        <h2
          key={stepIdx}
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#111",
            margin: "0 0 8px",
            letterSpacing: "-0.4px",
            animation: "fadeSlideUp 0.35s ease forwards",
          }}
        >
          {TITLES[stepIdx]}
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "#888",
            margin: "0 0 32px",
            lineHeight: 1.6,
            minHeight: 44,
            transition: "opacity 0.25s ease",
            opacity: msgVisible ? 1 : 0,
          }}
        >
          {isFinishing
            ? "Server responded — wrapping up!"
            : STEPS[stepIdx]?.msg}
        </p>

        <div
          style={{
            background: "#e2e0d8",
            borderRadius: 100,
            height: 6,
            overflow: "hidden",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#111",
              borderRadius: 100,
              transition: "width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#aaa" }}>
            {STEPS[stepIdx]?.label}
          </span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>
            {progress}%
          </span>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { stroke-dashoffset: -200; }
        }
      `}</style>
    </div>
  );
}

function SpinIcon({ progress }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const filled = (progress / 100) * circ;

  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: "#fff",
        border: "1px solid #e5e3de",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <circle
          cx="24"
          cy="24"
          r={r}
          stroke="#e2e0d8"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          stroke="#111"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ - filled}`}
          strokeDashoffset={circ / 4}
          style={{
            transition:
              "stroke-dasharray 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
          }}
        />
        <circle
          cx="24"
          cy="24"
          r={r}
          stroke="#bbb"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="8 62"
          style={{ animation: "spin 1.4s linear infinite" }}
        />
      </svg>
    </div>
  );
}
