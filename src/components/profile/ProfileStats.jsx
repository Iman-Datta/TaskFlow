import { useSelector } from "react-redux";
import { CheckCircle2, Clock, Trash2, Zap } from "lucide-react";

export default function ProfileStats() {
  const tasks = useSelector((state) => state.tasks?.tasks || []);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed && !t.deleted).length;
  const deleted = tasks.filter((t) => t.deleted).length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total tasks",
      value: total,
      icon: <Zap size={14} />,
      color: "text-zinc-500 dark:text-zinc-400",
      bg: "bg-zinc-100 dark:bg-zinc-800/60",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 size={14} />,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 dark:bg-emerald-500/[0.08]",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock size={14} />,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 dark:bg-amber-500/[0.08]",
    },
    {
      label: "Trashed",
      value: deleted,
      icon: <Trash2 size={14} />,
      color: "text-red-500 dark:text-red-400",
      bg: "bg-red-500/10 dark:bg-red-500/[0.08]",
    },
  ];

  return (
    <div className="mb-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">
        Your stats
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map(({ label, value, icon, color, bg }) => (
          <div
            key={label}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60
              bg-white dark:bg-zinc-900/40 flex items-center gap-3"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${bg} ${color}`}
            >
              {icon}
            </div>
            <div>
              <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100 leading-none mb-0.5">
                {value}
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Completion rate bar */}
      <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
            Completion rate
          </p>
          <p className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400">
            {rate}%
          </p>
        </div>
        <div className="h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
