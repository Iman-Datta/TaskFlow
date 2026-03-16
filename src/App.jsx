import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./features/auth/authSlice";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import CheckEmail from "./pages/CheckEmail";
import Task from "./pages/Task";
import Completed from "./pages/Completed";
import Trash from "./pages/Trash";
import OAuthSuccess from "./pages/OAuthSuccess";
import About from "./pages/About";

const API = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch(); //

  // Check user login or not
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/auth/me`, {
          credentials: "include", // passing cookies
        });

        if (!res.ok) {
          dispatch(clearUser()); // making logout mode
          return;
        }

        const data = await res.json();

        dispatch(setUser(data.user)); // Making login mode
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
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
