import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setUser,
  clearUser,
  setAccessToken,
  setAuthLoading,
} from "./features/auth/authSlice";
import { Toaster } from "sonner";

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
import LoadingScreen  from "./components/LoadingScreen ";
import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();
  const isAuthLoading = useSelector((state) => state.auth.isAuthLoading);
  const theme = useSelector((state) => state.theme.theme);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const newToken = await refreshAccessToken();
        if (!newToken) {
          dispatch(clearUser());
          return;
        }
        dispatch(setAccessToken(newToken));
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
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
      } finally {
        dispatch(setAuthLoading(false));
      }
    };
    checkAuth();
  }, [dispatch]);

  // Paste this inside your isAuthLoading block

  if (showLoader) {
    return (
      <LoadingScreen 
        backendReady={!isAuthLoading}
        onComplete={() => setShowLoader(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 pt-2 transition-colors duration-300">
      <Toaster
        position="top-right"
        theme={theme}
        expand
        gap={8}
        closeButton
        toastOptions={{
          duration: 4000,
          classNames: {
            toast: `
              font-sans
              !rounded-2xl
              !border !border-zinc-200/60 dark:!border-zinc-700/40
              !bg-white/80 dark:!bg-zinc-950/80
              !shadow-xl !shadow-black/[0.08] dark:!shadow-black/50
              !px-5 !py-4
              !min-w-[320px]
            `,
            title:
              "!text-[13.5px] !font-semibold !text-zinc-900 dark:!text-zinc-100",
            description:
              "!text-[12.5px] !text-zinc-500 dark:!text-zinc-400 !mt-0.5",
            closeButton: `
            !border !border-zinc-200 dark:!border-zinc-700
            !bg-white/80 dark:!bg-zinc-800/80
            !text-zinc-400 dark:!text-zinc-500
            hover:!text-zinc-700 dark:hover:!text-zinc-200
            !rounded-lg
          `,
            success: "!border-l-[3px] !border-l-emerald-500",
            error: "!border-l-[3px] !border-l-red-500",
            warning: "!border-l-[3px] !border-l-amber-500",
            info: "!border-l-[3px] !border-l-blue-500",
          },
        }}
      />
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
