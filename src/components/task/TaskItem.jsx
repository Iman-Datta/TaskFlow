import {
  Trash2,
  Clock,
  Pencil,
  Calendar as CalendarIcon,
  RotateCcw,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState, useRef, useEffect } from "react";

const categoryOptions = [
  "Work",
  "Personal",
  "Study",
  "Health",
  "Finance",
  "Shopping",
  "Home",
  "Fitness",
  "Learning",
  "Custom",
];

const categoryColors = {
  Work: "bg-blue-500/10   text-blue-500   border-blue-500/20   dark:bg-blue-500/10   dark:text-blue-400   dark:border-blue-500/20",
  Personal:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  Study:
    "bg-violet-500/10 text-violet-500  border-violet-500/20 dark:bg-violet-500/10  dark:text-violet-400 dark:border-violet-500/20",
  Health:
    "bg-rose-500/10   text-rose-500    border-rose-500/20   dark:bg-rose-500/10   dark:text-rose-400   dark:border-rose-500/20",
  Finance:
    "bg-amber-500/10  text-amber-600   border-amber-500/20  dark:bg-amber-500/10  dark:text-amber-400  dark:border-amber-500/20",
  Shopping:
    "bg-pink-500/10   text-pink-500    border-pink-500/20   dark:bg-pink-500/10   dark:text-pink-400   dark:border-pink-500/20",
  Home: "bg-orange-500/10 text-orange-500  border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  Fitness:
    "bg-cyan-500/10   text-cyan-600    border-cyan-500/20   dark:bg-cyan-500/10   dark:text-cyan-400   dark:border-cyan-500/20",
  Learning:
    "bg-indigo-500/10 text-indigo-500  border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
};

function TaskItem({
  task,
  variant = "normal",
  deleteCandidate,
  isRemoving,
  onToggleStatus,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onUpdate,
  onRestore,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isCompleted = task.status === "Completed";
  const isDeletePending = deleteCandidate === task._id;
  const textareaRef = useRef(null);

  // Mount animation
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const [editedData, setEditedData] = useState({
    taskname: task.title,
    description: task.description,
    category: task.category,
    deadline: task.deadline ? new Date(task.deadline) : null,
    priority: task.priority,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setEditedData({
      taskname: task.title,
      description: task.description,
      category: categoryOptions.includes(task.category)
        ? task.category
        : "Custom",
      categoryInput: categoryOptions.includes(task.category)
        ? ""
        : task.category,
      deadline: task.deadline ? new Date(task.deadline) : null,
      priority: task.priority,
    });
    setIsEditing(true);
  };

  const handleSubmit = () => {
    const finalCategory =
      editedData.category === "Custom"
        ? editedData.categoryInput?.trim() || "Other"
        : editedData.category;
    onUpdate(task._id, {
      taskname: editedData.taskname,
      description: editedData.description,
      category: finalCategory,
      priority: editedData.priority,
      deadline: editedData.deadline
        ? format(editedData.deadline, "yyyy-MM-dd")
        : null,
    });
    setIsEditing(false);
  };

  // Auto-resize textarea
  const handleTextareaChange = (e) => {
    handleChange(e);
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
    el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const el = textareaRef.current;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 120) + "px";
    }
  }, [isEditing]);

  const getRemainingTime = (deadline) => {
    if (!deadline) return null;
    const diff = new Date(deadline) - new Date();
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const getDeleteRemaining = (deletedAt) => {
    if (!deletedAt) return null;
    const diff = new Date(deletedAt).getTime() + 86400000 - Date.now();
    if (diff <= 0) return "Deleting soon";
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  // Description preview (collapsed)
  const descPreview =
    task.description?.length > 100
      ? task.description.slice(0, 100) + "…"
      : task.description;
  const hasLongDesc = task.description?.length > 100;

  return (
    <div
      className={`
        transition-all duration-450 ease-in-out
        ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
        ${
          isRemoving
            ? variant === "normal" && isCompleted
              ? // Complete: slide right + fade + green tint
                "opacity-0 translate-x-8 scale-95 bg-emerald-50 dark:bg-emerald-950/20"
              : // Delete: slide left + fade + shrink height
                "opacity-0 -translate-x-6 scale-95 max-h-0 overflow-hidden"
            : ""
        }
      `}
      style={{ transitionDuration: isRemoving ? "420ms" : "300ms" }}
    >
      <div
        className={`
          relative bg-white dark:bg-zinc-900
          border rounded-2xl p-5
          shadow-sm hover:shadow-lg hover:-translate-y-0.5
          transition-all duration-300
          ${
            isEditing
              ? "border-emerald-300/70 dark:border-emerald-700/40 ring-1 ring-emerald-400/10 dark:ring-emerald-500/10"
              : "border-zinc-200 dark:border-zinc-800"
          }
          ${variant === "normal" && isCompleted ? "opacity-50 scale-[0.98]" : ""}
        `}
      >
        {/* Edit mode top accent strip */}
        {isEditing && (
          <div className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-2xl bg-gradient-to-r from-emerald-400 via-emerald-300/60 to-transparent" />
        )}

        <div className="flex justify-between items-start gap-4">
          {/* ── LEFT ── */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {variant === "normal" && (
              <div className="mt-1 shrink-0">
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => onToggleStatus(task._id)}
                  className="data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600 rounded-lg
                    transition-all duration-200 hover:scale-110"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Title */}
              {isEditing ? (
                <input
                  name="taskname"
                  value={editedData.taskname}
                  onChange={handleChange}
                  className="
                    w-full bg-transparent
                    text-lg font-semibold leading-snug
                    text-zinc-900 dark:text-zinc-100
                    border-b-2 border-dashed border-zinc-200 dark:border-zinc-700
                    hover:border-zinc-300 dark:hover:border-zinc-600
                    focus:border-solid focus:border-emerald-400 dark:focus:border-emerald-500
                    focus:outline-none transition-all duration-200 pb-0.5
                  "
                />
              ) : (
                <h2
                  className={`text-lg font-semibold leading-snug transition-all duration-300 ${
                    variant === "normal" && isCompleted
                      ? "line-through text-zinc-400 opacity-70"
                      : "text-zinc-900 dark:text-zinc-100"
                  }`}
                >
                  {task.title}
                </h2>
              )}

              {/* Description — improved */}
              {isEditing ? (
                <div className="mt-3">
                  {/* Label */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
                      Description
                    </span>
                    <span className="text-[10px] text-zinc-300 dark:text-zinc-600">
                      {editedData.description?.length || 0} chars
                    </span>
                  </div>
                  {/* Textarea with pill border */}
                  <div
                    className="relative rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700
                    hover:border-zinc-300 dark:hover:border-zinc-600
                    focus-within:border-solid focus-within:border-emerald-400 dark:focus-within:border-emerald-500
                    focus-within:ring-1 focus-within:ring-emerald-400/20
                    transition-all duration-200 bg-zinc-50/50 dark:bg-zinc-800/30"
                  >
                    <textarea
                      ref={textareaRef}
                      name="description"
                      value={editedData.description}
                      onChange={handleTextareaChange}
                      rows={2}
                      placeholder="Add a description…"
                      className="
                        w-full px-3 py-2.5 resize-none bg-transparent
                        text-sm leading-relaxed
                        text-zinc-600 dark:text-zinc-400
                        placeholder:text-zinc-300 dark:placeholder:text-zinc-600
                        focus:outline-none rounded-xl
                      "
                    />
                  </div>
                </div>
              ) : (
                task.description && (
                  <div className="mt-1.5">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {hasLongDesc && !descExpanded
                        ? descPreview
                        : task.description}
                    </p>
                    {hasLongDesc && (
                      <button
                        onClick={() => setDescExpanded((p) => !p)}
                        className="flex items-center gap-0.5 mt-1 text-[11px] font-medium text-zinc-400 hover:text-emerald-500 transition-colors duration-150"
                      >
                        <ChevronDown
                          size={12}
                          className={`transition-transform duration-200 ${descExpanded ? "rotate-180" : ""}`}
                        />
                        {descExpanded ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
                )
              )}

              {/* Category */}
              <div className="mt-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 shrink-0">
                      Category
                    </span>
                    {editedData.category === "Custom" ? (
                      <input
                        type="text"
                        name="categoryInput"
                        placeholder="Enter category…"
                        value={editedData.categoryInput || ""}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            categoryInput: e.target.value,
                          }))
                        }
                        className="text-xs px-2.5 py-1 rounded-md
                          bg-zinc-50 dark:bg-zinc-800/60
                          border border-dashed border-zinc-300 dark:border-zinc-600
                          text-zinc-700 dark:text-zinc-300
                          focus:outline-none focus:border-solid focus:border-emerald-400 dark:focus:border-emerald-500
                          transition-all duration-200"
                      />
                    ) : (
                      <select
                        name="category"
                        value={editedData.category}
                        onChange={(e) =>
                          setEditedData((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className="text-xs px-2.5 py-1 rounded-md
                          bg-zinc-50 dark:bg-zinc-800/60
                          border border-dashed border-zinc-300 dark:border-zinc-600
                          text-zinc-700 dark:text-zinc-300
                          focus:outline-none focus:border-solid focus:border-emerald-400 dark:focus:border-emerald-500
                          transition-all duration-200 cursor-pointer"
                      >
                        {categoryOptions.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat === "Custom" ? "Other / Custom" : cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ) : (
                  <span
                    className={`
                    inline-flex items-center gap-1.5
                    text-[11px] font-semibold tracking-wider uppercase
                    px-2.5 py-1 rounded-md border
                    ${categoryColors[task.category] || "bg-sky-500/10 text-sky-400 border-sky-500/20"}
                  `}
                  >
                    <svg
                      width="6"
                      height="6"
                      viewBox="0 0 6 6"
                      className="shrink-0 opacity-60"
                    >
                      <circle cx="3" cy="3" r="3" fill="currentColor" />
                    </svg>
                    {task.category}
                  </span>
                )}
              </div>

              {/* Deadline */}
              <div className="mt-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500 shrink-0">
                      Deadline
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          className="inline-flex items-center gap-1.5
                          text-xs px-2.5 py-1 rounded-md
                          bg-zinc-50 dark:bg-zinc-800/60
                          border border-dashed border-zinc-300 dark:border-zinc-600
                          text-zinc-600 dark:text-zinc-400
                          hover:border-zinc-400 dark:hover:border-zinc-500
                          focus:outline-none transition-all duration-200"
                        >
                          <CalendarIcon className="h-3 w-3 text-zinc-400" />
                          {editedData.deadline
                            ? format(editedData.deadline, "dd MMM yyyy")
                            : "Pick a date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent
                        align="start"
                        className="w-auto p-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl"
                      >
                        <Calendar
                          mode="single"
                          selected={editedData.deadline}
                          onSelect={(date) =>
                            setEditedData((prev) => ({
                              ...prev,
                              deadline: date,
                            }))
                          }
                          captionLayout="dropdown"
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  variant === "normal" && (
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                      <span className="text-zinc-500 dark:text-zinc-400">
                        {task.deadline &&
                          format(new Date(task.deadline), "dd MMM yyyy")}
                      </span>
                      {task.deadline && (
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-colors
                          ${
                            getRemainingTime(task.deadline) === "Expired"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {getRemainingTime(task.deadline)}
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="flex flex-col items-end gap-4 shrink-0">
            {/* Priority */}
            {isEditing ? (
              <div className="flex flex-col items-end gap-1.5">
                <span className="text-[10px] uppercase tracking-widest font-semibold text-zinc-400 dark:text-zinc-500">
                  Priority
                </span>
                <select
                  name="priority"
                  value={editedData.priority}
                  onChange={handleChange}
                  className="text-xs px-2.5 py-1 rounded-md
                    bg-zinc-50 dark:bg-zinc-800/60
                    border border-dashed border-zinc-300 dark:border-zinc-600
                    text-zinc-700 dark:text-zinc-300
                    focus:outline-none focus:border-solid focus:border-emerald-400 dark:focus:border-emerald-500
                    transition-all duration-200 cursor-pointer"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            ) : (
              <span
                className={`
                inline-flex items-center gap-1.5
                text-[11px] font-semibold tracking-wider uppercase
                px-3 py-1 rounded-lg
                border-l-[3px] border border-transparent
                transition-all duration-200
                ${task.priority === "high" ? "border-l-red-500    bg-red-50/80    text-red-600    border-red-100    dark:bg-zinc-800/80 dark:text-red-400    dark:border-zinc-700/40 dark:border-l-red-500" : ""}
                ${task.priority === "medium" ? "border-l-amber-500  bg-amber-50/80  text-amber-600  border-amber-100  dark:bg-zinc-800/80 dark:text-amber-400  dark:border-zinc-700/40 dark:border-l-amber-500" : ""}
                ${task.priority === "low" ? "border-l-emerald-500 bg-emerald-50/80 text-emerald-600 border-emerald-100 dark:bg-zinc-800/80 dark:text-emerald-400 dark:border-zinc-700/40 dark:border-l-emerald-500" : ""}
              `}
              >
                {task.priority}
              </span>
            )}

            {/* Action buttons */}
            {isEditing ? (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                    bg-emerald-500 hover:bg-emerald-400 text-white
                    shadow-sm shadow-emerald-500/20
                    active:scale-[0.97] transition-all duration-150"
                >
                  <Check size={12} strokeWidth={2.5} /> Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                    border border-zinc-200 dark:border-zinc-700
                    text-zinc-500 dark:text-zinc-400
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    hover:text-zinc-700 dark:hover:text-zinc-200
                    active:scale-[0.97] transition-all duration-150"
                >
                  <X size={12} strokeWidth={2.5} /> Cancel
                </button>
              </div>
            ) : variant === "normal" ? (
              <div className="flex gap-2">
                <button
                  onClick={handleEditClick}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10
                    active:scale-90 transition-all duration-150"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10
                    active:scale-90 transition-all duration-150"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : variant === "completed" ? (
              <div className="flex gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore?.(task._id)}
                  className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg
                    border-zinc-200 dark:border-zinc-700
                    hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-300
                    dark:hover:bg-emerald-950 dark:hover:border-emerald-800
                    active:scale-[0.97] transition-all duration-150"
                >
                  <RotateCcw size={13} /> Restore
                </Button>
                <button
                  onClick={() => onDelete(task._id)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10
                    active:scale-90 transition-all duration-150"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ) : variant === "trash" ? (
              <div className="flex flex-col items-end gap-2">
                {task.deletedAt && (
                  <div className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
                    <Clock size={12} />
                    Auto delete in {getDeleteRemaining(task.deletedAt)}
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRestore?.(task._id)}
                  className="flex items-center gap-1.5 h-8 px-3 text-xs rounded-lg
                    border-zinc-200 dark:border-zinc-700
                    hover:bg-emerald-50 hover:text-emerald-500 hover:border-emerald-300
                    dark:hover:bg-emerald-950 dark:hover:border-emerald-800
                    active:scale-[0.97] transition-all duration-150"
                >
                  <RotateCcw size={13} /> Restore
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Delete confirmation */}
        {isDeletePending && (
          <div
            className="mt-3 overflow-hidden rounded-xl
            border border-red-200/60 dark:border-red-700/30
            bg-gradient-to-r from-red-50/80 via-red-50/40 to-transparent
            dark:from-red-900/20 dark:via-zinc-900/60 dark:to-zinc-900/20
            animate-in fade-in slide-in-from-bottom-1 duration-200"
          >
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-7 h-7 rounded-lg shrink-0
                  bg-red-100 dark:bg-red-900/30 border border-red-200/80 dark:border-red-700/40"
                >
                  <Trash2
                    size={13}
                    className="text-red-500 dark:text-red-400"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-red-700 dark:text-red-400 leading-tight">
                    Delete task?
                  </span>
                  <span className="text-[11px] text-red-500/70 dark:text-zinc-500 leading-tight mt-0.5">
                    This action cannot be undone
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onCancelDelete}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium
                    text-zinc-500 dark:text-zinc-400
                    border border-zinc-200/80 dark:border-zinc-700/50
                    hover:bg-white dark:hover:bg-zinc-800
                    hover:text-zinc-800 dark:hover:text-zinc-200
                    active:scale-[0.97] transition-all duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirmDelete}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold
                    bg-red-600 hover:bg-red-500 dark:bg-red-600/80 dark:hover:bg-red-500/90
                    text-white border border-red-700/30
                    shadow-sm shadow-red-900/25
                    active:scale-[0.97] transition-all duration-150"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            </div>
            <div className="h-[2px] w-full bg-gradient-to-r from-red-400/40 via-red-300/20 to-transparent dark:from-red-700/50 dark:via-red-800/20 dark:to-transparent" />
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskItem;
