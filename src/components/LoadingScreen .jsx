import { useEffect, useState, useRef } from "react";

const STEPS = [
  { at: 0, label: "Getting things ready", msg: "This will only take a moment" },
  { at: 30, label: "Almost there", msg: "Warming things up for you..." },
  { at: 60, label: "Just a second", msg: "Nearly done, hang tight!" },
  { at: 85, label: "Ready soon", msg: "Opening your dashboard..." },
];

const TICK_MS = 200;
const TICK_TOTAL = (60 * 1000) / TICK_MS;

function ease(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function getIdx(p) {
  let i = 0;
  STEPS.forEach((s, j) => {
    if (p >= s.at) i = j;
  });
  return i;
}

const css = `
  @keyframes ls-rotate {
    to { transform: rotate(360deg); }
  }
  @keyframes ls-dot-pulse {
    0%, 100% { transform: scale(1);   opacity: 1;  }
    50%       { transform: scale(1.4); opacity: .7; }
  }
  @keyframes ls-shimmer {
    from { transform: translateX(-200%); }
    to   { transform: translateX(300%);  }
  }
  .ls-ring-group {
    transform-origin: 30px 30px;
    animation: ls-rotate 1.4s cubic-bezier(.4, 0, .6, 1) infinite;
  }
  .ls-head-dot {
    transform-origin: 30px 6px;
    animation: ls-dot-pulse 1.4s ease-in-out infinite;
  }
  .ls-shimmer {
    animation: ls-shimmer 1.8s ease-in-out infinite;
  }
  .ls-label {
    transition: opacity 200ms ease;
  }
`;

export default function LoadingScreen({ backendReady, onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);
  const [initialDone, setInitialDone] = useState(false);

  const progressRef = useRef(0);
  const tickRef = useRef(0);
  const backendDone = useRef(false);
  const finishing = useRef(false);
  const intervalRef = useRef(null);
  const prevIdx = useRef(0);

  function setP(val) {
    const clamped = Math.min(100, val);
    progressRef.current = clamped;
    setProgress(Math.round(clamped));
  }

  function changeStep(idx) {
    setLabelVisible(false);
    setTimeout(() => {
      setStepIdx(idx);
      setLabelVisible(true);
    }, 190);
  }

  function finishUp() {
    if (finishing.current) return;
    finishing.current = true;
    clearInterval(intervalRef.current);

    const rush = setInterval(() => {
      const next = Math.min(100, progressRef.current + 0.8);
      setP(next);

      const idx = getIdx(next);
      if (idx !== prevIdx.current) {
        prevIdx.current = idx;
        changeStep(idx);
      }

      if (next >= 100) {
        clearInterval(rush);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 500);
        }, 600);
      }
    }, 18);
  }

  // Watch backendReady prop — when App.jsx signals done, set the flag
  useEffect(() => {
    if (backendReady) {
      backendDone.current = true;
    }
  }, [backendReady]);

  // Main tick loop + fallback safety timer
  useEffect(() => {
    setTimeout(() => {
      setP(15);
      setTimeout(() => setInitialDone(true), 600);
    }, 300);

    const fallback = setTimeout(() => {
      backendDone.current = true;
    }, 180_000);

    intervalRef.current = setInterval(() => {
      tickRef.current++;
      const t = Math.min(tickRef.current / TICK_TOTAL, 1);
      const delta = (15 + ease(t) * 77 - progressRef.current) * 0.12;
      if (!finishing.current && delta > 0) setP(progressRef.current + delta);

      const idx = getIdx(progressRef.current);
      if (idx !== prevIdx.current) {
        prevIdx.current = idx;
        changeStep(idx);
      }

      if (backendDone.current && !finishing.current) finishUp();
    }, TICK_MS);

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(fallback);
    };
  }, []);

  if (done) return null;

  const step = STEPS[stepIdx];

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <style>{css}</style>

      <div className="flex flex-col items-center">
        {/* Comet spinner */}
        <div style={{ width: 60, height: 60, marginBottom: "2.2rem" }}>
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs>
              <linearGradient
                id="ls-trail"
                gradientUnits="userSpaceOnUse"
                x1="30"
                y1="4"
                x2="56"
                y2="30"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>

            {/* Track ring */}
            <circle
              cx="30"
              cy="30"
              r="24"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeOpacity=".1"
            />

            {/* Rotating comet group */}
            <g className="ls-ring-group">
              {/* Fading tail arc */}
              <circle
                cx="30"
                cy="30"
                r="24"
                fill="none"
                stroke="url(#ls-trail)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray="38 113"
              />
              {/* Bright head dot */}
              <circle
                cx="30"
                cy="6"
                r="3"
                fill="#10b981"
                className="ls-head-dot"
              />
            </g>
          </svg>
        </div>

        {/* Label */}
        <p
          className="ls-label"
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "#111",
            margin: "0 0 5px",
            opacity: labelVisible ? 1 : 0,
          }}
        >
          {step.label}
        </p>

        {/* Sub message */}
        <p
          className="ls-label"
          style={{
            fontSize: 13,
            color: "#aaa",
            margin: "0 0 2.2rem",
            opacity: labelVisible ? 1 : 0,
          }}
        >
          {step.msg}
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: 200,
            height: 2,
            borderRadius: 99,
            overflow: "hidden",
            background: "#f0f0f0",
            marginBottom: 9,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "#10b981",
              borderRadius: 99,
              transition: `width ${initialDone ? 220 : 600}ms cubic-bezier(.4,0,.2,1)`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="ls-shimmer"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)",
              }}
            />
          </div>
        </div>

        {/* Percentage */}
        <p style={{ fontSize: 12, color: "#bbb", letterSpacing: ".06em" }}>
          {progress}%
        </p>
      </div>
    </div>
  );
}
