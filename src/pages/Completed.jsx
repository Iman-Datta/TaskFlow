import { useState, useEffect } from "react";

import TaskList from "../components/task/TaskList";
import TaskHeader from "../components/task/TaskHeader";
import toast from "react-hot-toast";

import { useSelector, useDispatch } from "react-redux";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = import.meta.env.VITE_API_URL;

function Completed() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const dispatch = useDispatch();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        if (!accessToken) return;

        const res = await fetchWithAuth(
          `${API}/tasks?status=Completed&isDeleted=false`,
          {},
          dispatch,
          accessToken,
        );

        if (!res) return;

        const data = await res.json();

        if (!Array.isArray(data)) return;

        const formatted = data.map((task) => ({
          _id: task._id,
          title: task.taskname,
          description: task.description,
          category: task.category,
          status: task.status,
          deadline: task.deadline,
          priority: task.priority,
        }));

        setCompletedTasks(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompleted();
  }, [accessToken, dispatch]);

  const restoreTask = async (id) => {
    try {
      if (!accessToken) return;
      const res = await fetchWithAuth(
        `${API}/tasks/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Todo" }),
        },
        dispatch,
        accessToken,
      );

      if (!res) return;

      if (!res.ok) {
        throw new Error("Failed to restore task");
      }

      // remove task instantly from completed list
      setCompletedTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // Delete task
  const requestDelete = (_id) => {
    setDeleteCandidate(_id);
  };
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    if (!accessToken) return;
    const res = await fetchWithAuth(
      `${API}/tasks/${deleteCandidate}`,
      {
        method: "DELETE",
      },
      dispatch,
      accessToken,
    );

    if (!res) return;
    if (!res.ok) return;

    setCompletedTasks((prev) => prev.filter((t) => t._id !== deleteCandidate));
    setDeleteCandidate(null);
    toast.success("Task moved to recycle bin. It will be deleted in 24 hours.");
  };
  const cancelDelete = () => {
    setDeleteCandidate(null);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-950 px-6 py-10 max-w-5xl mx-auto min-h-screen transition-colors duration-300">
      <div className="pt-32">
        <TaskHeader count={completedTasks.length} title="Completed Tasks" />
      </div>

      <TaskList
        tasks={completedTasks}
        deleteCandidate={deleteCandidate}
        onDelete={requestDelete}
        onConfirmDelete={confirmDelete}
        onCancelDelete={cancelDelete}
        variant="completed"
        onRestore={restoreTask}
      />
    </div>
  );
}

export default Completed;
