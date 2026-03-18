import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import TaskList from "../components/task/TaskList";
import TaskHeader from "../components/task/TaskHeader";
import AddTaskButton from "../components/task/AddTaskButton";
import AddTaskForm from "../components/task/AddTaskForm";
import TaskFilters from "../components/task/TaskFilters";
import TaskSort from "../components/task/Tasksort";
import SearchBar from "../components/task/SearchBar";

import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = import.meta.env.VITE_API_URL;

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

const getCategories = (tasks) => [
  ...new Set(tasks.map((t) => t.category).filter(Boolean)),
];

function Task() {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [removingIds, setRemovingIds] = useState(new Set());

  // Single shared state — filters + sort live together so Task.jsx
  // can pass the whole object to both children and apply all logic in one place

  const [filters, setFilters] = useState({
    priority: "All",
    category: "All",
    deadline: "",
    sortField: "createdAt",
    order: "desc",
  });

  const { user, loading } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const accessToken = useSelector((s) => s.auth.accessToken);


  useEffect(() => {
    const handleFetch = async () => {
      try {
        if (!accessToken) return;

        const params = new URLSearchParams({
          status: "Todo",
          isDeleted: "false",
        });

        if (filters.priority !== "All")
          params.append("priority", filters.priority);
        if (filters.category !== "All")
          params.append("category", filters.category);

        // Only delegate createdAt sort to server — deadline & priority sort client-side
        if (filters.sortField === "createdAt") {
          params.append("sortField", "createdAt");
          params.append("order", filters.order);
        }

        const res = await fetchWithAuth(
          `${API}/tasks?${params.toString()}`,
          {},
          dispatch,
          accessToken,
        );
        if (!res) return;

        const data = await res.json();
        const formatted = data.map((task) => ({
          _id: task._id,
          title: task.taskname,
          description: task.description,
          category: task.category,
          status: task.status,
          deadline: task.deadline,
          priority: task.priority,
        }));

        setTasks(formatted);
        if (filters.category === "All")
          setAllCategories(getCategories(formatted));
      } catch (err) {
        console.error(err);
      }
    };

    handleFetch();
  }, [
    filters.priority,
    filters.category,
    filters.sortField,
    filters.order,
    accessToken,
    dispatch,
  ]);

  // ── Client-side filter + sort ─────────────────────────────────
  const displayTasks = (() => {
    let result = [...tasks];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q),
      );
    }

    // Deadline filter — keep tasks due on or before picked date
    if (filters.deadline) {
      const cutoff = new Date(filters.deadline);
      cutoff.setHours(23, 59, 59, 999);
      result = result.filter(
        (t) => t.deadline && new Date(t.deadline) <= cutoff,
      );
    }

    // Sort
    result.sort((a, b) => {
      const dir = filters.order === "asc" ? 1 : -1;

      if (filters.sortField === "priority") {
        const ra = PRIORITY_RANK[a.priority] ?? 99;
        const rb = PRIORITY_RANK[b.priority] ?? 99;
        return (ra - rb) * dir;
      }

      if (filters.sortField === "deadline") {
        const da = a.deadline ? new Date(a.deadline).getTime() : Infinity;
        const db = b.deadline ? new Date(b.deadline).getTime() : Infinity;
        if (da === Infinity && db === Infinity) return 0;
        if (da === Infinity) return 1;
        if (db === Infinity) return -1;
        return (da - db) * dir;
      }

      // createdAt — ObjectId prefix encodes creation time
      if (filters.sortField === "createdAt") {
        return (new Date(a._id) - new Date(b._id)) * dir;
      }

      return 0;
    });

    return result;
  })();

  // ── Handlers ─────────────────────────────────────────────────
  const toggleStatus = async (_id) => {
    const task = tasks.find((t) => t._id === _id);
    if (!task) return;
    const newStatus = task.status === "Completed" ? "Todo" : "Completed";
    const res = await fetchWithAuth(
      `${API}/tasks/${_id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      },
      dispatch,
      accessToken,
    );
    if (!res) {
      toast.error("Failed to update task.");
      return;
    }
    const updatedTask = await res.json();
    const formatted = {
      _id: updatedTask._id,
      title: updatedTask.taskname,
      description: updatedTask.description,
      category: updatedTask.category,
      status: updatedTask.status,
      deadline: updatedTask.deadline,
      priority: updatedTask.priority,
    };
    if (formatted.status === "Completed") {
      setTasks((prev) => prev.map((t) => (t._id === _id ? formatted : t)));
      setTimeout(() => {
        setRemovingIds((prev) => new Set([...prev, _id]));
        setTimeout(() => {
          setTasks((prev) => prev.filter((t) => t._id !== _id));
          setRemovingIds((prev) => {
            const s = new Set(prev);
            s.delete(_id);
            return s;
          });
        }, 450);
      }, 300);
    } else {
      setTasks((prev) => prev.map((t) => (t._id === _id ? formatted : t)));
    }
    toast.success("Task completed and moved to completed tasks.");
  };

  const requestDelete = (_id) => setDeleteCandidate(_id);
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const res = await fetchWithAuth(
      `${API}/tasks/${deleteCandidate}`,
      { method: "DELETE" },
      dispatch,
      accessToken,
    );
    if (!res) return toast.error("Failed to delete task.");
    setRemovingIds((prev) => new Set([...prev, deleteCandidate]));
    setTimeout(() => {
      setTasks((prev) => prev.filter((t) => t._id !== deleteCandidate));
      setRemovingIds((prev) => {
        const s = new Set(prev);
        s.delete(deleteCandidate);
        return s;
      });
      setDeleteCandidate(null);
    }, 450);
    toast.success("Moved to trash.");
  };
  const cancelDelete = () => setDeleteCandidate(null);

  const addTask = async (newTask) => {
    const res = await fetchWithAuth(
      `${API}/tasks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskname: newTask.taskname,
          description: newTask.description,
          category: newTask.category,
          deadline: newTask.deadline,
          priority: newTask.priority,
        }),
      },
      dispatch,
      accessToken,
    );
    if (!res) return toast.error("Failed to add task.");
    const savedTask = await res.json();
    setTasks((prev) => [
      {
        _id: savedTask._id,
        title: savedTask.taskname,
        description: savedTask.description,
        priority: savedTask.priority,
        category: savedTask.category,
        deadline: savedTask.deadline,
        status: savedTask.status,
      },
      ...prev,
    ]);
    setShowForm(false);
    toast.success("Task added.");
  };

  const editTask = async (_id, editedTask) => {
    try {
      const res = await fetchWithAuth(
        `${API}/tasks/${_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedTask),
        },
        dispatch,
        accessToken,
      );
      if (!res) return;
      const updatedTask = await res.json();
      setTasks((prev) =>
        prev.map((t) =>
          t._id === _id
            ? {
                _id: updatedTask._id,
                title: updatedTask.taskname,
                description: updatedTask.description,
                category: updatedTask.category,
                status: updatedTask.status,
                deadline: updatedTask.deadline,
                priority: updatedTask.priority,
              }
            : t,
        ),
      );
      toast.success("Changes saved.");
    } catch (err) {
      console.error(err);
      toast.error("Update failed.");
    }
  };

  if (loading) return null;
  if (!user) return <Navigate to="/auth" />;

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 px-6 py-10 max-w-5xl mx-auto min-h-screen transition-colors duration-300">
      <div className="pt-32">
        <TaskHeader count={displayTasks.length} title="My Tasks" />
        {!showForm && <AddTaskButton onClick={() => setShowForm(true)} />}
      </div>

      {showForm && (
        <div className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 rounded-2xl p-6 shadow-lg shadow-black/10 dark:shadow-black/30 transition-all duration-300">
          <AddTaskForm
            onCancel={() => setShowForm(false)}
            onAddTask={addTask}
          />
        </div>
      )}

      <div className="flex justify-between items-center mb-8 gap-4 mt-10">
        <SearchBar setSearch={setSearch} />

        {/* Sort + Filter side by side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <TaskSort filters={filters} setFilters={setFilters} />
          <TaskFilters
            filters={filters}
            setFilters={setFilters}
            categories={allCategories}
          />
        </div>
      </div>

      <TaskList
        tasks={displayTasks}
        removingIds={removingIds}
        deleteCandidate={deleteCandidate}
        onToggleStatus={toggleStatus}
        onDelete={requestDelete}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        onUpdate={editTask}
      />
    </div>
  );
}

export default Task;
