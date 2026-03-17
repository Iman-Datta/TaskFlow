import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

import TaskList from "../components/task/TaskList";
import TaskHeader from "../components/task/TaskHeader";
import AddTaskButton from "../components/task/AddTaskButton";
import AddTaskForm from "../components/task/AddTaskForm";
import TaskFilters from "../components/task/TaskFilters";
import SearchBar from "../components/task/SearchBar";

import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = import.meta.env.VITE_API_URL;

function Task() {
  const [showForm, setShowForm] = useState(false); // Task form
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const [priorityFilter, setPriorityFilter] = useState("All");

  const { user, loading } = useSelector((state) => state.auth); // From redux

  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        if (!accessToken) return;

        const res = await fetchWithAuth(
          `${API}/tasks?status=Todo&isDeleted=false`,
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
      } catch (err) {
        console.error(err);
      }
    };

    handleFetch();
  }, [priorityFilter, accessToken, dispatch]);

  // Status update
  const toggleStatus = async (_id) => {
    const task = tasks.find((t) => t._id === _id);
    if (!task) return;

    const newStatus = task.status === "Completed" ? "Todo" : "Completed";

    const res = await fetchWithAuth(
      `${API}/tasks/${_id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      },
      dispatch,
      accessToken,
    );

    if (!res) return;

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
        setTasks((prev) => prev.filter((t) => t._id !== _id));
      }, 500);
    } else {
      setTasks((prev) => prev.map((t) => (t._id === _id ? formatted : t)));
    }

    toast.success("Task completed and moved to completed tasks.");
  };

  // Delete task
  const requestDelete = (_id) => {
    setDeleteCandidate(_id);
  };
  const confirmDelete = async () => {
    if (!deleteCandidate) return;

    const res = await fetchWithAuth(
      `${API}/tasks/${deleteCandidate}`,
      {
        method: "DELETE",
      },
      dispatch,
      accessToken,
    );

    if (!res) return;

    setTasks((prev) => prev.filter((t) => t._id !== deleteCandidate));
    setDeleteCandidate(null);

    toast.success("Task moved to recycle bin. It will be deleted in 24 hours.");
  };
  const cancelDelete = () => {
    setDeleteCandidate(null);
  };

  // Add task from form
  const addTask = async (newTask) => {
    const res = await fetchWithAuth(
      `${API}/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

    if (!res) return;

    const savedTask = await res.json();

    const formatted = {
      _id: savedTask._id,
      title: savedTask.taskname,
      description: savedTask.description,
      priority: savedTask.priority,
      category: savedTask.category,
      deadline: savedTask.deadline,
      status: savedTask.status,
    };

    setTasks((prev) => [formatted, ...prev]);
    setShowForm(false);

    toast.success("New task added.");
  };

  // Edit task
  const editTask = async (_id, editedTask) => {
    try {
      const res = await fetchWithAuth(
        `${API}/tasks/${_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTask),
        },
        dispatch,
        accessToken,
      );

      if (!res) return;

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

      setTasks((prev) =>
        prev.map((task) => (task._id === _id ? formatted : task)),
      );

      toast.success("Task updated.");
    } catch (error) {
      console.error(error);
      toast.error("Update failed. Please try again.");
    }
  };

  // Filtering
  const filteredTasks = tasks.filter((task) => {
    return (
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase())
    );
  });

  // If user is not login state go to auth page
  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 px-6 py-10 max-w-5xl mx-auto min-h-screen transition-colors duration-300">
      <div className="pt-32">
        <TaskHeader count={filteredTasks.length} title="My Tasks" />
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
        <TaskFilters
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />
      </div>

      <TaskList
        tasks={filteredTasks}
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
