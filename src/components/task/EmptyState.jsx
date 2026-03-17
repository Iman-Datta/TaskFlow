export default function EmptyState({ variant = "tasks" }) {
  const config = {
    tasks: {
      title: "All clear!",
      subtitle: "No tasks yet. Hit the + button to add your first one.",
      icon: (
        <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
          <rect
            x="14"
            y="18"
            width="52"
            height="6"
            rx="3"
            className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <rect
            x="14"
            y="32"
            width="40"
            height="6"
            rx="3"
            className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <rect
            x="14"
            y="46"
            width="48"
            height="6"
            rx="3"
            className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <circle
            cx="8"
            cy="21"
            r="3"
            fill="none"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1.5"
          />
          <circle
            cx="8"
            cy="35"
            r="3"
            fill="none"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1.5"
          />
          <circle
            cx="8"
            cy="49"
            r="3"
            fill="none"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1.5"
          />
          <circle
            cx="58"
            cy="58"
            r="14"
            className="fill-emerald-100 dark:fill-emerald-950 stroke-emerald-400 dark:stroke-emerald-700"
            strokeWidth="1.5"
          />
          <path
            d="M52 58l4 4 8-8"
            fill="none"
            className="stroke-emerald-600 dark:stroke-emerald-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    completed: {
      title: "Nothing finished yet",
      subtitle: "Complete tasks from My Tasks and they'll show up here.",
      icon: (
        <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
          <circle
            cx="40"
            cy="38"
            r="22"
            className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <path
            d="M29 38l7 7 15-15"
            fill="none"
            className="stroke-zinc-500 dark:stroke-zinc-600"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M20 64 Q40 54 60 64"
            fill="none"
            className="stroke-zinc-300 dark:stroke-zinc-700"
            strokeWidth="1"
            strokeDasharray="3 2"
          />
        </svg>
      ),
    },
    trash: {
      title: "Bin is empty",
      subtitle: "Deleted tasks will appear here. Nothing to see right now.",
      icon: (
        <svg width="72" height="72" viewBox="0 0 80 80" fill="none">
          <rect
            x="22"
            y="28"
            width="36"
            height="32"
            rx="4"
            className="fill-zinc-200 dark:fill-zinc-800 stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <path
            d="M22 28l4-8h28l4 8"
            fill="none"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <line
            x1="40"
            y1="28"
            x2="40"
            y2="20"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <line
            x1="32"
            y1="35"
            x2="32"
            y2="52"
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="40"
            y1="35"
            x2="40"
            y2="52"
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <line
            x1="48"
            y1="35"
            x2="48"
            y2="52"
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M16 28h48"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="1"
          />
          <circle
            cx="57"
            cy="57"
            r="10"
            className="fill-red-100 dark:fill-red-950 stroke-red-300 dark:stroke-red-800"
            strokeWidth="1.5"
          />
          <path
            d="M53 57h8M57 53v8"
            fill="none"
            className="stroke-red-500 dark:stroke-red-400"
            strokeWidth="2"
            strokeLinecap="round"
            transform="rotate(45 57 57)"
          />
        </svg>
      ),
    },
  };

  const { title, subtitle, icon } = config[variant];

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="opacity-80">{icon}</div>
      <p className="text-base font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </p>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs">
        {subtitle}
      </p>
    </div>
  );
}
