import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHASES = [
  {
    at: 0,
    label: "Waking up",
    description: "Server is coming online from sleep.",
  },
  {
    at: 22,
    label: "Connecting",
    description: "Establishing a secure connection.",
  },
  {
    at: 58,
    label: "Authenticating",
    description: "Verifying your session.",
  },
  {
    at: 88,
    label: "Almost ready",
    description: "Loading your workspace.",
  },
];

/* ── thin 1px progress line at very top ── */
function TopBar({ pct }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] h-[2px] bg-zinc-200 dark:bg-zinc-800">
      <motion.div
        className="h-full bg-emerald-500 relative"
        initial={{ width: "0%" }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* glow tip */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-[6px] rounded-full bg-emerald-400 blur-sm opacity-80" />
      </motion.div>
    </div>
  );
}

/* ── step row ── */
function Steps({ phaseIdx }) {
  return (
    <div className="flex flex-col gap-0">
      {PHASES.map((p, i) => {
        const done = i < phaseIdx;
        const active = i === phaseIdx;

        return (
          <motion.div
            key={p.label}
            animate={{ opacity: i > phaseIdx ? 0.38 : 1 }}
            transition={{ duration: 0.5 }}
            className={`
              flex items-center gap-4 py-3
              ${i < PHASES.length - 1 ? "border-b border-zinc-200 dark:border-zinc-800" : ""}
            `}
          >
            {/* icon */}
            <div className="w-5 flex justify-center flex-shrink-0">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.svg
                    key="check"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <circle
                      cx="8"
                      cy="8"
                      r="7"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                    <motion.path
                      d="M5 8.2L7.2 10.4L11 6"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    />
                  </motion.svg>
                ) : active ? (
                  <motion.div
                    key="dot"
                    className="w-2 h-2 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    exit={{ scale: 0 }}
                  />
                ) : (
                  <motion.div
                    key="idle"
                    className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* text */}
            <div className="flex-1 min-w-0">
              <p
                className={`
                text-sm leading-none mb-0
                ${
                  active
                    ? "font-semibold text-zinc-900 dark:text-zinc-100"
                    : done
                      ? "font-medium text-emerald-600 dark:text-emerald-400"
                      : "font-normal text-zinc-400 dark:text-zinc-600"
                }
                transition-all duration-400
              `}
              >
                {p.label}
              </p>
              <AnimatePresence>
                {active && (
                  <motion.p
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 3 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-xs text-zinc-500 dark:text-zinc-500 leading-none overflow-hidden"
                  >
                    {p.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* right label */}
            <div className="flex-shrink-0">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] font-medium text-emerald-500"
                  >
                    Done
                  </motion.span>
                ) : active ? (
                  <motion.span
                    key="progress"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-zinc-400 dark:text-zinc-500"
                  >
                    In progress
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ── main ── */
export default function Loader({ label = "Loading application" }) {
  const [elapsed, setElapsed] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed((e) => {
        const n = e + 1;
        const next = PHASES.reduce((acc, p, i) => (n >= p.at ? i : acc), 0);
        setPhaseIdx(next);
        return n;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.min(99, Math.round((elapsed / 120) * 100));
  const remaining = Math.max(0, 120 - elapsed);
  const timeStr =
    remaining > 0
      ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
      : "—";

  return (
    <>
      <TopBar pct={pct} />

      <div className="fixed inset-0 z-[9998] bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center transition-colors duration-300">
        {/* very subtle center vignette — same as your page bg, no extra color */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 30%, var(--vignette, rgba(0,0,0,0.015)) 100%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full max-w-sm mx-6"
        >
          {/* ── header ── */}
          <div className="mb-8">
            {/* status pill — same style as your existing badges */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 mb-5">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.3, repeat: Infinity }}
              />
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
                {label}
              </span>
            </div>

            {/* headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={PHASES[phaseIdx].label}
                initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-2"
              >
                {PHASES[phaseIdx].label}
              </motion.h1>
            </AnimatePresence>

            <p className="text-sm text-zinc-500 dark:text-zinc-500 leading-relaxed">
              Free-tier server is waking up. This is a one-time cold start.
            </p>
          </div>

          {/* ── card — exactly your project's card style ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/10 dark:shadow-black/30"
          >
            <Steps phaseIdx={phaseIdx} />
          </motion.div>

          {/* ── footer ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between mt-5 px-1"
          >
            <span className="text-xs text-zinc-400 dark:text-zinc-600">
              Render · Free tier · Cold start
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-500 tabular-nums">
              ~{timeStr}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
