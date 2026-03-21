import { useEffect, useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL;

const TICK_MS = 500;
const MIN_SECS = 120; // 2 minutes minimum
const TICK_TOTAL = (MIN_SECS * 1000) / TICK_MS;

const STEPS = [
  {
    startPct: 0,
    endPct: 18,
    label: "Waking up",
    msg: "Initialising core services...",
    phase: "Phase 1 of 5",
  },
  {
    startPct: 18,
    endPct: 36,
    label: "Loading",
    msg: "Fetching remote resources...",
    phase: "Phase 2 of 5",
  },
  {
    startPct: 36,
    endPct: 55,
    label: "Preparing",
    msg: "Configuring environment...",
    phase: "Phase 3 of 5",
  },
  {
    startPct: 55,
    endPct: 74,
    label: "Almost there",
    msg: "Compiling final modules...",
    phase: "Phase 4 of 5",
  },
  {
    startPct: 74,
    endPct: 92,
    label: "Finalising",
    msg: "Running integrity checks...",
    phase: "Phase 5 of 5",
  },
  {
    startPct: 92,
    endPct: 100,
    label: "Ready",
    msg: "Launching application...",
    phase: "Complete",
  },
];

const NUM_TICKS = 40;

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgressState] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [labelVisible, setLabelVisible] = useState(true);
  const [msgVisible, setMsgVisible] = useState(true);

  const tickRef = useRef(0);
  const progressRef = useRef(0);
  const backendDone = useRef(false);
  const finishingRef = useRef(false);
  const intervalRef = useRef(null);
  const prevStepIdx = useRef(0);

  function setProgress(p) {
    const clamped = Math.min(100, p);
    progressRef.current = clamped;
    setProgressState(Math.round(clamped));
  }

  function finishUp() {
    if (finishingRef.current) return;
    finishingRef.current = true;
    setFinishing(true);
    clearInterval(intervalRef.current);

    const rush = setInterval(() => {
      const next = Math.min(100, progressRef.current + 1.5);
      setProgress(next);
      if (next >= 100) {
        clearInterval(rush);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 800);
        }, 600);
      }
    }, 30);
  }

  // ONLY CHANGE INSIDE useEffect

  useEffect(() => {
    fetch(API)
      .then(() => {
        backendDone.current = true;
      })
      .catch(() => {
        backendDone.current = true;
      });

    // fallback safety
    setTimeout(() => {
      backendDone.current = true;
    }, 180000); // keep your 3 min fallback

    intervalRef.current = setInterval(() => {
      tickRef.current++;
      const tick = tickRef.current;

      const t = Math.min(tick / TICK_TOTAL, 1);
      const target = easeInOutCubic(t) * 92;

      // 🔥 slightly faster initial movement
      const delta = (target - progressRef.current) * 0.08;

      if (!finishingRef.current && delta > 0) {
        setProgress(progressRef.current + delta);
      }

      const newIdx = STEPS.findIndex((s, i) => {
        const next = STEPS[i + 1];
        return (
          progressRef.current >= s.startPct &&
          (!next || progressRef.current < next.startPct)
        );
      });

      const idx = Math.max(0, newIdx === -1 ? STEPS.length - 1 : newIdx);

      if (idx !== prevStepIdx.current) {
        prevStepIdx.current = idx;
        setLabelVisible(false);
        setMsgVisible(false);

        setTimeout(() => {
          setStepIdx(idx);
          setLabelVisible(true);
          setMsgVisible(true);
        }, 300);
      }

      // 🔥 MAIN FIX (IMPORTANT)
      // instead of waiting full 2 minutes
      if (
        backendDone.current &&
        progressRef.current >= 55 &&
        !finishingRef.current
      ) {
        finishUp();
      }
    }, TICK_MS);

    return () => clearInterval(intervalRef.current);
  }, []);

  if (done) return null;

  const step = STEPS[finishing ? STEPS.length - 1 : stepIdx];
  const ticks = Array.from(
    { length: NUM_TICKS },
    (_, i) => (i / NUM_TICKS) * 100 <= progress,
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Grain */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Mono:wght@300;400&display=swap');
        @keyframes orb-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes ring-pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.04);opacity:0.6} }
        @keyframes fade-up { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blob-drift { 0%,100%{transform:translate(0,0)scale(1)} 50%{transform:translate(20px,30px)scale(1.05)} }
      `}</style>

      {/* Orb */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          width: 440,
          maxWidth: "90vw",
          fontFamily: "'DM Mono', monospace",
          color: "#f0ede6",
        }}
      >
        <div
          style={{
            position: "relative",
            width: 100,
            height: 100,
            marginBottom: 48,
            animation: "fade-up 1s ease 0.2s both",
          }}
        >
          {[0, -14, -28].map((inset, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset,
                borderRadius: "50%",
                border: `1px solid rgba(240,237,230,${0.08 - i * 0.025})`,
                animation: `ring-pulse ${4 + i}s ease-in-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              inset: 10,
              borderRadius: "50%",
              background:
                "conic-gradient(from 0deg, rgba(180,140,100,0.7), rgba(240,237,230,0.5), rgba(80,120,160,0.6), rgba(140,100,180,0.5), rgba(180,140,100,0.7))",
              filter: "blur(2px)",
              animation: "orb-spin 8s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 14,
              borderRadius: "50%",
              background: "#0a0a0a",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 28,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 40% 35%, rgba(240,237,230,0.3) 0%, transparent 60%)",
            }}
          />
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 12,
            letterSpacing: "0.45em",
            textTransform: "uppercase",
            color: "rgba(240,237,230,0.3)",
            marginBottom: 40,
            animation: "fade-up 1s ease 0.6s both",
          }}
        >
          System
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28,
            fontStyle: "italic",
            color: "#f0ede6",
            marginBottom: 6,
            textAlign: "center",
            opacity: labelVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
            minHeight: 36,
            animation: "fade-up 1s ease 1s both",
          }}
        >
          {step.label}
        </div>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(240,237,230,0.3)",
            marginBottom: 36,
            textAlign: "center",
            opacity: msgVisible ? 1 : 0,
            transition: "opacity 0.3s ease",
            animation: "fade-up 1s ease 1.2s both",
          }}
        >
          {step.msg}
        </div>

        <div style={{ width: "100%", animation: "fade-up 1s ease 1.4s both" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(240,237,230,0.25)",
              }}
            >
              {step.phase}
            </span>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: "rgba(240,237,230,0.8)",
              }}
            >
              {progress}%
            </span>
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "rgba(240,237,230,0.08)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: 1,
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, rgba(180,140,100,0.6) 0%, rgba(240,237,230,0.9) 100%)",
                boxShadow: "0 0 12px rgba(240,237,230,0.4)",
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: -3,
                  top: -3,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#f0ede6",
                  boxShadow: "0 0 10px rgba(240,237,230,0.8)",
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            {ticks.map((passed, i) => (
              <div
                key={i}
                style={{
                  width: 1,
                  height: 4,
                  background: passed
                    ? "rgba(240,237,230,0.3)"
                    : "rgba(240,237,230,0.1)",
                  transition: "background 0.5s ease",
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(240,237,230,0.15)",
            animation: "fade-up 2s ease 2.5s both",
          }}
        >
          {finishing
            ? "Server ready · Launching now"
            : "Estimated 2 minutes · Please wait"}
        </div>
      </div>
    </div>
  );
}
