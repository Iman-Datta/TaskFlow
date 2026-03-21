import { Github, Linkedin, Mail, ArrowRight, ExternalLink } from "lucide-react";
import { useEffect, useRef } from "react";

const techStack = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Redux",
  "TailwindCSS",
  "REST APIs",
  "JavaScript",
];

function useFadeUp(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`;

    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
        ob.disconnect();
      }
    });

    ob.observe(el);
    return () => ob.disconnect();
  }, [delay]);

  return ref;
}

function useStaggerChildren(stagger = 60, baseDelay = 0) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = Array.from(container.children);

    children.forEach((child, i) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(14px)";
      child.style.transition = `opacity 0.45s ease ${baseDelay + i * stagger}ms, transform 0.45s ease ${baseDelay + i * stagger}ms`;
    });

    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        children.forEach((child) => {
          child.style.opacity = "1";
          child.style.transform = "translateY(0)";
        });
        ob.disconnect();
      }
    });

    ob.observe(container);
    return () => ob.disconnect();
  }, [stagger, baseDelay]);

  return ref;
}

function Divider() {
  return <div className="h-px bg-zinc-100 dark:bg-zinc-800/80 my-10" />;
}

function About() {
  const heroRef = useFadeUp(0);
  const projectRef = useFadeUp(80);
  const stackRef = useFadeUp(140);
  const ctaRef = useFadeUp(180);
  const connectRef = useFadeUp(220);
  const tagsRef = useStaggerChildren(55, 200);
  const statsRef = useStaggerChildren(80, 100);

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Hero */}
        <div ref={heroRef} className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6
            bg-emerald-500/[0.07] dark:bg-emerald-500/[0.06]
            border border-emerald-500/[0.15]
            text-[11px] font-semibold text-emerald-600 uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            First deployed project · MERN Stack
          </div>

          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            TaskFlow
          </h1>

          <p className="text-[15px] text-zinc-500 dark:text-zinc-400 max-w-lg">
            A minimalist task manager built with the MERN stack.
          </p>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="flex gap-6 mb-10">
          {[
            { value: "MERN", label: "Stack" },
            { value: "Redux", label: "State" },
            { value: "Tailwind", label: "Styling" },
            { value: "Free", label: "Pricing" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-bold">{value}</p>
              <p className="text-xs text-zinc-400">{label}</p>
            </div>
          ))}
        </div>

        <Divider />

        {/* About */}
        <div ref={projectRef} className="mb-10">
          <p className="text-sm text-zinc-500">
            TaskFlow is my first full-stack project. Built to understand real
            app structure.
          </p>
        </div>

        {/* Tech */}
        <div ref={stackRef} className="mb-10">
          <div ref={tagsRef} className="flex flex-wrap gap-2">
            {techStack.map((tech) => (
              <span key={tech} className="px-3 py-1 border rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <Divider />

        {/* Developer */}
        <div ref={ctaRef} className="mb-10">
          <p className="text-sm text-zinc-500 mb-4">Built by Iman Datta.</p>

          {/* ❌ Removed useless button */}
          {/* Only useful link kept */}
          <a
            href="https://github.com/Iman-Datta/TaskFlow"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 border rounded"
          >
            <ExternalLink size={14} />
            View source
          </a>
        </div>

        <Divider />

        {/* Connect */}
        <div ref={connectRef}>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: <Github size={16} />,
                label: "GitHub",
                value: "@Iman-Datta",
                href: "https://github.com/Iman-Datta",
              },
              {
                icon: <Linkedin size={16} />,
                label: "LinkedIn",
                value: "Iman Datta",
                href: "https://www.linkedin.com/in/iman-datta-161615307/",
              },
              {
                icon: <Mail size={16} />,
                label: "Email",
                value: "Say hello",
                href: "https://mail.google.com/mail/?view=cm&fs=1&to=dattaiman56@gmail.com",
              },
            ].map(({ icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-center border p-3 rounded"
              >
                {icon}
                <p>{label}</p>
                <p className="text-xs text-zinc-500">{value}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
