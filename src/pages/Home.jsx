import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function useFadeUp(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          ob.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    ob.observe(el);
    return () => ob.disconnect();
  }, [delay]);
  return ref;
}

const features = [
  {
    title: "Smart Priorities",
    desc: "Highlight what matters most and stay focused on tasks that move the needle.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Deadline Tracking",
    desc: "Never miss a due date with intuitive tracking and time-left indicators.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    title: "Secure & Private",
    desc: "Your data is encrypted and accessible only to you. No ads, no tracking.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
];

function Home() {
  const navigate = useNavigate();
  const badgeRef = useFadeUp(0);
  const heroRef = useFadeUp(80);
  const subRef = useFadeUp(160);
  const btnsRef = useFadeUp(220);
  const cardsRef = useFadeUp(100);

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-28">
        <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8
              bg-emerald-500/[0.08] dark:bg-emerald-500/[0.06]
              border border-emerald-500/20 dark:border-emerald-500/15
              text-[12px] font-medium text-emerald-600 dark:text-emerald-400"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Simple. Focused. Powerful.
          </div>

          {/* Headline */}
          <h1
            ref={heroRef}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]
              text-zinc-900 dark:text-zinc-100 mb-6 max-w-3xl"
          >
            Your tasks, <span className="text-emerald-500">beautifully</span>{" "}
            organized.
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="text-[16px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-10 max-w-lg"
          >
            DoTo is a minimalist task manager built for people who value
            clarity. Prioritize, schedule, and accomplish, without the clutter.
          </p>

          {/* CTAs */}
          <div
            ref={btnsRef}
            className="flex items-center gap-3 flex-wrap justify-center"
          >
            <button
              onClick={() => navigate("/task")}
              className="px-7 py-3 rounded-xl text-sm font-semibold
                bg-emerald-600 hover:bg-emerald-500
                text-white
                shadow-lg shadow-emerald-500/20
                hover:-translate-y-0.5 hover:shadow-emerald-500/30
                active:translate-y-0 active:shadow-md
                transition-all duration-200"
            >
              Get started free
            </button>
            <button
              onClick={() => navigate("/about")}
              className="px-7 py-3 rounded-xl text-sm font-medium
                border border-zinc-200 dark:border-zinc-800
                bg-white dark:bg-zinc-900/60
                text-zinc-600 dark:text-zinc-400
                hover:bg-zinc-50 dark:hover:bg-zinc-800
                hover:text-zinc-900 dark:hover:text-zinc-100
                hover:-translate-y-0.5
                transition-all duration-200"
            >
              Learn more
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 bg-zinc-50 border-t border-b border-zinc-200 dark:bg-zinc-900/30 dark:border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section label */}
          <div ref={cardsRef} className="text-center mb-12">
            <p
              className="text-[11px] font-semibold uppercase tracking-widest
        text-zinc-400 dark:text-zinc-600 mb-3"
            >
              Everything you need
            </p>
            <h2
              className="text-2xl font-bold tracking-tight
        text-zinc-900 dark:text-zinc-100"
            >
              Built for how you actually work
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map(({ title, desc, icon }, i) => (
              <div
                key={title}
                className="group p-6 rounded-2xl
            border border-zinc-200 dark:border-zinc-800/60
            bg-white dark:bg-zinc-900/40
            shadow-sm dark:shadow-none
            hover:border-emerald-200 dark:hover:border-emerald-900
            hover:bg-white dark:hover:bg-zinc-900/70
            hover:-translate-y-1 hover:shadow-md
            transition-all duration-250"
                style={{
                  opacity: 0,
                  animation: `fadeUpCard 0.55s ease forwards`,
                  animationDelay: `${i * 80 + 100}ms`,
                }}
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl mb-5
            bg-emerald-500/10 dark:bg-emerald-500/[0.06]
            border border-emerald-500/20 dark:border-emerald-500/12
            flex items-center justify-center
            text-emerald-500 dark:text-emerald-400
            group-hover:bg-emerald-500/[0.15] group-hover:border-emerald-500/30
            transition-all duration-200"
                >
                  {icon}
                </div>
                <h3 className="text-[15px] font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {title}
                </h3>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ── Bottom CTA ── */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="text-2xl font-bold tracking-tight
            text-zinc-900 dark:text-zinc-100 mb-4"
          >
            Ready to get things done?
          </h2>
          <p className="text-[14px] text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
            Built for simplicity. Designed for productivity. DoTo helps you
            stay organized without overwhelming you.
          </p>
          <button
            onClick={() => navigate("/task")}
            className="px-8 py-3 rounded-xl text-sm font-semibold
              bg-zinc-900 hover:bg-zinc-800
              dark:bg-zinc-100 dark:hover:bg-zinc-200
              text-white dark:text-zinc-900
              hover:-translate-y-0.5
              transition-all duration-200"
          >
            Start organizing →
          </button>
        </div>
      </section>

      <style>{`
        @keyframes fadeUpCard {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Home;
