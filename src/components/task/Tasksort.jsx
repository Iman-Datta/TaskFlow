import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownUp, ArrowUp, ArrowDown, Check } from "lucide-react";

const SORT_OPTIONS = [
  { field: "createdAt", label: "Date created" },
  { field: "deadline", label: "Deadline" },
  { field: "priority", label: "Priority" },
];

function TaskSort({ filters, setFilters }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const activeOption = SORT_OPTIONS.find((o) => o.field === filters.sortField);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectField = (field) => {
    if (filters.sortField === field) {
      setFilters((p) => ({ ...p, order: p.order === "desc" ? "asc" : "desc" }));
    } else {
      setFilters((p) => ({ ...p, sortField: field, order: "desc" }));
    }
  };

  const toggleOrder = (e) => {
    e.stopPropagation();
    setFilters((p) => ({ ...p, order: p.order === "desc" ? "asc" : "desc" }));
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      {/* ── Trigger ── */}
      <div
        className={`
        flex items-stretch rounded-xl border overflow-hidden transition-all duration-200
        bg-white dark:bg-zinc-900
        ${
          open
            ? "border-zinc-400 dark:border-zinc-600"
            : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        }
      `}
      >
        {/* Left: icon + label + active field name */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 pl-3 pr-2.5 py-2.5 text-sm font-medium transition-colors
            text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 select-none"
        >
          <ArrowDownUp
            size={14}
            className="text-zinc-400 dark:text-zinc-500 flex-shrink-0"
          />
          <span className="text-zinc-400 dark:text-zinc-500 font-normal">
            Sort:
          </span>
          <motion.span
            key={activeOption?.label}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="font-semibold text-zinc-800 dark:text-zinc-200"
          >
            {activeOption?.label}
          </motion.span>
        </button>

        {/* Divider */}
        <div className="w-px bg-zinc-200 dark:bg-zinc-800 my-1.5" />

        {/* Right: direction arrow */}
        <button
          onClick={toggleOrder}
          title={
            filters.order === "asc"
              ? "Ascending — click to flip"
              : "Descending — click to flip"
          }
          className="flex items-center justify-center px-2.5 transition-colors
            text-zinc-400 hover:text-zinc-700 dark:text-zinc-500 dark:hover:text-zinc-200 select-none"
        >
          <AnimatePresence mode="wait">
            {filters.order === "asc" ? (
              <motion.span
                key="asc"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <ArrowUp size={14} />
              </motion.span>
            ) : (
              <motion.span
                key="desc"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
              >
                <ArrowDown size={14} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="
              absolute right-0 top-[calc(100%+8px)] z-50
              w-52 rounded-xl overflow-hidden
              bg-white border border-zinc-200 shadow-lg shadow-black/8
              dark:bg-zinc-900 dark:border-zinc-800 dark:shadow-black/40
            "
          >
            {/* Field options */}
            <div className="p-1.5">
              {SORT_OPTIONS.map(({ field, label }) => {
                const active = filters.sortField === field;
                return (
                  <button
                    key={field}
                    onClick={() => {
                      selectField(field);
                      setOpen(false);
                    }}
                    className={`
                      w-full flex items-center justify-between gap-3
                      px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-150 text-left
                      ${
                        active
                          ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                      }
                    `}
                  >
                    <span>{label}</span>
                    {active && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="flex items-center gap-1 text-xs text-zinc-400 dark:text-zinc-500"
                      >
                        {filters.order === "asc" ? (
                          <ArrowUp size={11} />
                        ) : (
                          <ArrowDown size={11} />
                        )}
                        <Check size={11} className="text-emerald-500" />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Direction toggle */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 p-1.5">
              <div className="flex rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700 divide-x divide-zinc-200 dark:divide-zinc-700">
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, order: "asc" }));
                    setOpen(false);
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all duration-150
                    ${
                      filters.order === "asc"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }
                  `}
                >
                  <ArrowUp size={11} /> Ascending
                </button>
                <button
                  onClick={() => {
                    setFilters((p) => ({ ...p, order: "desc" }));
                    setOpen(false);
                  }}
                  className={`
                    flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold transition-all duration-150
                    ${
                      filters.order === "desc"
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-white text-zinc-500 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    }
                  `}
                >
                  <ArrowDown size={11} /> Descending
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TaskSort;
