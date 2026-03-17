import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
          Your tasks, beautifully organized.
        </h1>

        <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl">
          TaskFlow is a minimalist task manager built for people who value
          clarity. Prioritize, schedule, and accomplish — without the clutter.
        </p>

        <button
          onClick={() => navigate("/task")}
          className="
          bg-zinc-200 hover:bg-zinc-300
          dark:bg-zinc-800 dark:hover:bg-zinc-700
          text-zinc-900 dark:text-white
          px-6 py-3
          rounded-2xl font-semibold
          shadow-md shadow-black/10 dark:shadow-black/30
          hover:shadow-xl hover:-translate-y-1
          transition-all duration-300
        "
        >
          Get Started
        </button>
      </section>

      <section className="py-24 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center">
          <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-md shadow-black/10 dark:shadow-black/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
              Smart Priorities
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Highlight what matters most and stay focused on important tasks.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-md shadow-black/10 dark:shadow-black/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
              Deadline Tracking
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Keep track of deadlines with intuitive reminders and timers.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-800 rounded-2xl shadow-md shadow-black/10 dark:shadow-black/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
              Secure & Private
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your data is safe and accessible only to you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
          Why Choose TaskFlow?
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 mb-6">
          Built for simplicity. Designed for productivity. TaskFlow helps you
          stay organized without overwhelming you with unnecessary features.
        </p>
      </section>
    </div>
  );
}

export default Home;
