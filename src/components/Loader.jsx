import { useEffect, useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL;

const STEPS = [
  { at: 0, label: "Getting things ready", msg: "This will only take a moment" },
  { at: 30, label: "Almost there", msg: "Warming things up for you..." },
  { at: 60, label: "Just a second", msg: "Nearly done, hang tight!" },
  { at: 85, label: "Ready soon", msg: "Opening your dashboard..." },
];

const TICK_MS = 400;
const TICK_TOTAL = (120 * 1000) / TICK_MS;

function ease(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function getIdx(p) {
  let i = 0;
  STEPS.forEach((s, j) => {
    if (p >= s.at) i = j;
  });
  return i;
}

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [labelVisible, setLabelVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);

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
    }, 220);
  }

  function finishUp() {
    if (finishing.current) return;
    finishing.current = true;
    clearInterval(intervalRef.current);

    // Rush progress to 100 then navigate
    const rush = setInterval(() => {
      const next = Math.min(100, progressRef.current + 1.5);
      setP(next);

      const idx = getIdx(next);
      if (idx !== prevIdx.current) {
        prevIdx.current = idx;
        changeStep(idx);
      }

      if (next >= 100) {
        clearInterval(rush);
        changeStep(STEPS.length - 1);
        // Wait for user to see 100% then fade out
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(() => {
            setDone(true);
            onComplete?.();
          }, 500);
        }, 400);
      }
    }, 18);
  }

  useEffect(() => {
    // Call backend health endpoint to wake up the server
    fetch(`${API}/health`)
      .then(() => {
        backendDone.current = true;
      })
      .catch(() => {
        backendDone.current = true;
      });

    // Fallback in case server never responds
    const fallback = setTimeout(() => {
      backendDone.current = true;
    }, 180_000);

    intervalRef.current = setInterval(() => {
      tickRef.current++;
      const t = Math.min(tickRef.current / TICK_TOTAL, 1);
      const target = ease(t) * 92;
      const delta = (target - progressRef.current) * 0.09;

      // Slowly move progress up to 92% while waiting for backend
      if (!finishing.current && delta > 0) setP(progressRef.current + delta);

      const idx = getIdx(progressRef.current);
      if (idx !== prevIdx.current) {
        prevIdx.current = idx;
        changeStep(idx);
      }

      // Once backend responds, speed run to 100%
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
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg);  } }
        @keyframes spin2 { to { transform: rotate(-360deg); } }
        @keyframes spin3 { to { transform: rotate(360deg);  } }
        @keyframes shimmer {
          from { transform: translateX(-200%); }
          to   { transform: translateX(300%);  }
        }
        .spin1 { animation: spin  1s cubic-bezier(.6,0,.4,1) infinite; }
        .spin2 { animation: spin2 .75s cubic-bezier(.6,0,.4,1) infinite; }
        .spin3 { animation: spin3 .5s cubic-bezier(.6,0,.4,1) infinite; }
        .shimmer { animation: shimmer 1.4s ease-in-out infinite; }
      `}</style>

      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="relative w-20 h-20 mb-9">
          {/* Outer ring */}
          <div
            className="spin1 absolute inset-0 rounded-full"
            style={{
              border: "3px solid #f0fdf4",
              borderTopColor: "#10b981",
              borderRightColor: "#6ee7b7",
            }}
          />
          {/* Middle ring */}
          <div
            className="spin2 absolute rounded-full"
            style={{
              inset: 12,
              border: "2.5px solid #f4f4f5",
              borderBottomColor: "#10b981",
              borderLeftColor: "#a7f3d0",
            }}
          />
          {/* Inner ring */}
          <div
            className="spin3 absolute rounded-full"
            style={{
              inset: 25,
              border: "2px solid #f0fdf4",
              borderTopColor: "#34d399",
            }}
          />
          {/* Center dot */}
          <div
            className="absolute rounded-full bg-emerald-500 opacity-20"
            style={{ inset: 34 }}
          />
        </div>

        {/* Label */}
        <p
          className={`text-xl font-semibold text-zinc-900 mb-2 text-center transition-opacity duration-200 ${
            labelVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {step.label}
        </p>

        {/* Sub message */}
        <p
          className={`text-sm text-zinc-400 mb-10 text-center transition-opacity duration-200 ${
            labelVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {step.msg}
        </p>

        {/* Progress bar */}
        <div className="w-60 h-1 bg-zinc-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-emerald-500 rounded-full relative overflow-hidden"
            style={{
              width: `${progress}%`,
              transition: "width 450ms cubic-bezier(.4,0,.2,1)",
            }}
          >
            <div className="shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>

        {/* Percentage */}
        <p className="text-sm font-medium text-zinc-300">{progress}%</p>
      </div>
    </div>
  );
}
