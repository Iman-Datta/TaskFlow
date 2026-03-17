import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

// ── Outside component ──
function FieldError({ errors, field }) {
  if (!errors[field]) return null;
  return <p className="text-[11px] text-red-500 mt-1 px-1">{errors[field]}</p>;
}

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

function AddTaskForm({ onAddTask, onCancel }) {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    taskname: "",
    description: "",
    category: "",
    categoryInput: "",
    deadline: null,
    priority: "",
  });

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.taskname.trim())
      newErrors.taskname = "Task title is required.";
    if (!formData.priority) newErrors.priority = "Please select a priority.";
    if (!formData.category) newErrors.category = "Please select a category.";
    if (formData.category === "Custom" && !formData.categoryInput?.trim())
      newErrors.category = "Please enter a custom category.";
    if (!date) newErrors.deadline = "Please pick a deadline.";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalCategory =
      formData.category === "Custom"
        ? formData.categoryInput?.trim() || "Other"
        : formData.category;

    onAddTask({
      ...formData,
      category: finalCategory,
      deadline: format(date, "yyyy-MM-dd"),
    });

    setFormData({
      taskname: "",
      description: "",
      category: "",
      categoryInput: "",
      deadline: null,
      priority: "",
    });
    setDate(null);
    setErrors({});
  };

  const inputBase =
    "w-full bg-white dark:bg-zinc-900 rounded-xl px-4 py-2.5 " +
    "text-zinc-900 placeholder:text-zinc-500 " +
    "dark:text-zinc-100 dark:placeholder:text-zinc-500 " +
    "focus:outline-none focus:ring-2 transition ";

  const inputCls = (field) =>
    inputBase +
    (errors[field]
      ? "border border-red-400 dark:border-red-500 focus:ring-red-400/30"
      : "border border-zinc-300 dark:border-zinc-800 focus:ring-emerald-500");

  return (
    <div
      className="
      bg-white border border-zinc-200
      dark:bg-zinc-900 dark:border-zinc-800
      p-6 rounded-2xl
      shadow-xl shadow-black/10 dark:shadow-black/40
      mb-10 transition-colors duration-300
    "
    >
      <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Add New Task
      </h2>

      <div className="flex flex-col gap-4">
        {/* Title */}
        <div>
          <input
            type="text"
            name="taskname"
            placeholder="Task title *"
            className={inputCls("taskname")}
            value={formData.taskname}
            onChange={handleChange}
          />
          <FieldError errors={errors} field="taskname" />
        </div>

        {/* Description — optional */}
        <textarea
          placeholder="Description (optional)"
          className={`${inputBase} border border-zinc-300 dark:border-zinc-800 focus:ring-emerald-500 resize-none`}
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Priority + Category + Deadline */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Priority */}
          <div className="flex-1">
            <select
              name="priority"
              className={inputCls("priority")}
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="">Priority *</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <FieldError errors={errors} field="priority" />
          </div>

          {/* Category */}
          <div className="flex-1">
            {formData.category === "Custom" ? (
              <input
                type="text"
                placeholder="Enter category *"
                value={formData.categoryInput}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    categoryInput: e.target.value,
                  }));
                  if (errors.category)
                    setErrors((prev) => ({ ...prev, category: "" }));
                }}
                className={inputCls("category")}
              />
            ) : (
              <select
                name="category"
                value={formData.category}
                onChange={(e) => {
                  handleChange(e);
                  if (errors.category)
                    setErrors((prev) => ({ ...prev, category: "" }));
                }}
                className={inputCls("category")}
              >
                <option value="">Category *</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "Custom" ? "Other / Custom" : cat}
                  </option>
                ))}
              </select>
            )}
            <FieldError errors={errors} field="category" />
          </div>

          {/* Deadline */}
          <div className="flex flex-col flex-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`
                    justify-between
                    bg-white dark:bg-zinc-900
                    text-zinc-700 dark:text-zinc-200
                    hover:bg-zinc-100 dark:hover:bg-zinc-800
                    ${
                      errors.deadline
                        ? "border-red-400 dark:border-red-500"
                        : "border-zinc-300 dark:border-zinc-800"
                    }
                  `}
                  onClick={() => {
                    if (errors.deadline)
                      setErrors((prev) => ({ ...prev, deadline: "" }));
                  }}
                >
                  {date ? format(date, "dd MMM yyyy") : "Deadline *"}
                  <CalendarIcon className="ml-2 h-4 w-4 text-zinc-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-white border border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setOpen(false);
                    setErrors((prev) => ({ ...prev, deadline: "" }));
                  }}
                  className="rounded-lg border"
                  captionLayout="dropdown"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FieldError errors={errors} field="deadline" />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl
              bg-zinc-200 hover:bg-zinc-300 text-zinc-800
              dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300
              transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-xl
              bg-emerald-600 hover:bg-emerald-500
              text-white shadow-sm shadow-black/10 transition"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTaskForm;
