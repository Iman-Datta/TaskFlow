import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser, setAccessToken } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CheckEmail from "./pages/CheckEmail";
import Task from "./pages/Task";
import Completed from "./pages/Completed";
import Trash from "./pages/Trash";
import AuthCallback from "./pages/AuthCallback";
import About from "./pages/About";
import { refreshAccessToken } from "./utils/refreshAccessToken";

const API = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();

  // Check user login or not
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // ALWAYS try refresh first (because Redux is empty on reload)
        const newToken = await refreshAccessToken();

        if (!newToken) {
          dispatch(clearUser());
          return;
        }

        dispatch(setAccessToken(newToken));

        const res = await fetch(`${API}/auth/me`, {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          dispatch(clearUser());
          return;
        }

        const data = await res.json();

        dispatch(setUser(data.user));
      } catch {
        dispatch(clearUser());
      }
    };

    checkAuth();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 pt-2 transition-colors duration-300">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/checkEmail" element={<CheckEmail />} />
        <Route path="/task" element={<Task />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/oauth-success" element={<AuthCallback />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
