import { Github, Linkedin, Mail } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen pt-28 px-6 bg-white dark:bg-zinc-950 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          About Me
        </h1>

        {/* Description */}
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          Hi, I'm{" "}
          <span className="font-semibold text-emerald-500">Iman Datta</span>, a
          Computer Science and Engineering (IoT) student who enjoys building
          modern web applications and experimenting with new technologies.
        </p>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
          I mainly focus on backend development and love working with APIs,
          authentication systems, and databases. Recently I’ve been building
          projects like task management apps, authentication systems, and
          AI-powered tools.
        </p>

        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
          I also enjoy working with IoT and Arduino-based systems where hardware
          and software come together to solve real-world problems.
        </p>

        {/* Skills */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Skills
          </h2>

          <div className="flex flex-wrap gap-3">
            {[
              "React",
              "Node.js",
              "Express",
              "MongoDB",
              "Redux",
              "TailwindCSS",
              "Arduino",
              "IoT",
            ].map((skill) => (
              <span
                key={skill}
                className="px-4 py-1.5 rounded-xl text-sm
                bg-zinc-200 text-zinc-800
                dark:bg-zinc-800 dark:text-zinc-300">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
            Connect With Me
          </h2>

          <div className="flex gap-5">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-emerald-500 transition">
              <Github size={22} />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-500 hover:text-emerald-500 transition">
              <Linkedin size={22} />
            </a>

            <a
              href="mailto:yourmail@gmail.com"
              className="text-zinc-500 hover:text-emerald-500 transition">
              <Mail size={22} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;