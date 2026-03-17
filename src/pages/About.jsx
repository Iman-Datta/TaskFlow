import { Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";

const skills = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Redux",
  "TailwindCSS",
  "Arduino",
  "IoT",
  "REST APIs",
  "JavaScript",
];

const focusAreas = [
  { title: "Backend", sub: "APIs · Auth · Databases" },
  { title: "IoT & Hardware", sub: "Arduino · Embedded systems" },
  { title: "Frontend", sub: "React · Redux · Tailwind" },
  { title: "AI tools", sub: "AI-powered apps · Integrations" },
];

// Hook: animate element in when it scrolls into view
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-600">
        {children}
      </span>
      <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

function About() {
  const heroRef = useFadeIn(50);
  const quoteRef = useFadeIn(100);
  const focusRef = useFadeIn(150);
  const skillsRef = useFadeIn(200);
  const connectRef = useFadeIn(250);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-10">
        {/* ── Hero ── */}
        <div ref={heroRef} className="flex items-center gap-5">
          {/* Avatar */}
          <div
            className="w-16 h-16 rounded-full flex-shrink-0
            border-2 border-emerald-500/30 dark:border-emerald-500/20
            bg-emerald-500/10 dark:bg-emerald-500/[0.07]
            flex items-center justify-center"
          >
            <span className="text-xl font-bold tracking-tight text-emerald-500">
              ID
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Iman Datta
            </h1>
            {/* Status pill */}
            <div
              className="inline-flex items-center gap-2 mt-1.5
              px-3 py-1 rounded-full text-xs font-medium
              bg-emerald-500/10 dark:bg-emerald-500/[0.08]
              border border-emerald-500/20 dark:border-emerald-500/15
              text-emerald-600 dark:text-emerald-400"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Available for opportunities
            </div>
          </div>
        </div>

        {/* ── Quote block ── */}
        <div
          ref={quoteRef}
          className="flex gap-3 p-4 rounded-xl
            bg-zinc-50 dark:bg-zinc-900/60
            border border-zinc-200 dark:border-zinc-800"
        >
          <div className="w-[3px] rounded-full flex-shrink-0 self-stretch bg-emerald-500" />
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 italic">
            CSE (IoT) student building modern web apps and experimenting with
            new tech. Backend-first mindset — APIs, auth systems, databases.
            When I'm not coding, I'm wiring up Arduino projects where hardware
            and software meet to solve real problems.
          </p>
        </div>

        {/* ── Focus areas ── */}
        <div ref={focusRef}>
          <SectionLabel>Focus areas</SectionLabel>
          <div className="grid grid-cols-2 gap-3">
            {focusAreas.map(({ title, sub }, i) => (
              <div
                key={title}
                className="p-3.5 rounded-xl
                  border border-zinc-200 dark:border-zinc-800
                  bg-white dark:bg-zinc-900/40
                  hover:border-emerald-300 dark:hover:border-emerald-800
                  hover:-translate-y-0.5 hover:shadow-sm
                  transition-all duration-200"
                style={{
                  transitionDelay: `${i * 40}ms`,
                }}
              >
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-0.5">
                  {title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Skills ── */}
        <div ref={skillsRef}>
          <SectionLabel>Skills</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg text-sm font-medium
                  border border-zinc-200 dark:border-zinc-800
                  bg-white dark:bg-zinc-900/40
                  text-zinc-600 dark:text-zinc-400
                  hover:border-emerald-300 dark:hover:border-emerald-700
                  hover:text-emerald-600 dark:hover:text-emerald-400
                  hover:-translate-y-0.5
                  transition-all duration-200 cursor-default"
                style={{
                  // staggered entrance via inline style since Tailwind
                  // can't generate arbitrary delay values dynamically
                  opacity: 0,
                  animation: `skillIn 0.4s ease forwards`,
                  animationDelay: `${i * 45}ms`,
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* ── Connect ── */}
        <div ref={connectRef}>
          <SectionLabel>Connect</SectionLabel>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: <Github size={17} />,
                label: "GitHub",
                value: "@imandatta",
                href: "https://github.com",
              },
              {
                icon: <Linkedin size={17} />,
                label: "LinkedIn",
                value: "Iman Datta",
                href: "https://linkedin.com",
              },
              {
                icon: <Mail size={17} />,
                label: "Email",
                value: "Say hello",
                href: "mailto:yourmail@gmail.com",
              },
            ].map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl
                  border border-zinc-200 dark:border-zinc-800
                  bg-white dark:bg-zinc-900/40
                  hover:border-emerald-300 dark:hover:border-emerald-700
                  hover:-translate-y-1 hover:shadow-md hover:shadow-black/5
                  dark:hover:shadow-black/20
                  transition-all duration-200 text-center no-underline"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center
                  bg-zinc-100 dark:bg-zinc-800
                  text-zinc-500 dark:text-zinc-400
                  group-hover:bg-emerald-500/10 dark:group-hover:bg-emerald-500/[0.08]
                  group-hover:text-emerald-500 dark:group-hover:text-emerald-400
                  transition-all duration-200"
                >
                  {icon}
                </div>
                <div>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-600 mb-0.5">
                    {label}
                  </p>
                  <p
                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300
                    group-hover:text-emerald-600 dark:group-hover:text-emerald-400
                    transition-colors duration-200"
                  >
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Keyframe for skill pill stagger — injected once */}
      <style>{`
        @keyframes skillIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default About;
