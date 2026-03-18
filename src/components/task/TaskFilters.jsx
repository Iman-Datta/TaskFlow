import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";

const PRIORITIES = ["high", "medium", "low"];

const PRIORITY_STYLES = {
  high: "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-800/60 dark:text-red-400",
  medium:
    "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-800/60 dark:text-amber-400",
  low: "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-400",
};
const ACTIVE_PRIORITY_STYLES = {
  high: "bg-red-500 border-red-500 text-white",
  medium: "bg-amber-500 border-amber-500 text-white",
  low: "bg-emerald-500 border-emerald-500 text-white",
};

function TaskFilters({ filters, setFilters, categories = [] }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const activeCount = [
    filters.priority !== "All",
    filters.category !== "All",
    !!filters.deadline,
  ].filter(Boolean).length;

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const set = (key, val) => setFilters((p) => ({ ...p, [key]: val }));

  const clearAll = () =>
    setFilters((p) => ({
      ...p,
      priority: "All",
      category: "All",
      deadline: "",
    }));

  return (
    <div ref={panelRef} className="relative flex-shrink-0">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium
          transition-all duration-200 select-none
          ${
            open
              ? "bg-zinc-900 border-zinc-700 text-white dark:bg-white dark:border-zinc-200 dark:text-zinc-900"
              : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700"
          }
        `}
      >
        <SlidersHorizontal size={14} />
        <span>Filters</span>
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] font-bold"
            >
              {activeCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="
              absolute right-0 top-[calc(100%+8px)] z-50
              w-72 rounded-2xl
              bg-white border border-zinc-200 shadow-xl shadow-black/10
              dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-black/50
              overflow-hidden
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Filters
              </span>
              <div className="flex items-center gap-3">
                {activeCount > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  >
                    Clear all
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-5">
              {/* Priority */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                  Priority
                </p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => set("priority", "All")}
                    className={`
                      flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150
                      ${
                        filters.priority === "All"
                          ? "bg-zinc-900 border-zinc-700 text-white dark:bg-white dark:border-zinc-200 dark:text-zinc-900"
                          : "bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-300 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600"
                      }
                    `}
                  >
                    All
                  </button>
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() =>
                        set("priority", filters.priority === p ? "All" : p)
                      }
                      className={`
                        flex-1 py-1.5 rounded-lg border text-xs font-semibold capitalize transition-all duration-150
                        ${filters.priority === p ? ACTIVE_PRIORITY_STYLES[p] : PRIORITY_STYLES[p]}
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deadline */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                  Deadline before
                </p>
                <div className="relative">
                  <input
                    type="date"
                    value={filters.deadline}
                    onChange={(e) => set("deadline", e.target.value)}
                    className="
                      w-full px-3 py-2.5 rounded-xl border text-sm
                      bg-white border-zinc-200 text-zinc-900
                      dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200
                      focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                      transition-all duration-150
                    "
                  />
                  {filters.deadline && (
                    <button
                      onClick={() => set("deadline", "")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                  Category
                </p>
                <select
                  value={filters.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="
                    w-full px-3 py-2.5 rounded-xl border text-sm
                    bg-white border-zinc-200 text-zinc-900
                    dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                    transition-all duration-150
                  "
                >
                  <option value="All">All categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskFilters;
