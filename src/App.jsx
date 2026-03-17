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

const API = import.meta.env.VITE_API_URL;

function App() {
  const dispatch = useDispatch();
  const isAuthLoading = useSelector((state) => state.auth.isAuthLoading);
  const theme = useSelector((state) => state.theme.theme); // ← MISSING

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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute w-72 h-72 rounded-full bg-emerald-500 opacity-10 blur-[80px] -top-16 -left-16 animate-pulse" />
        <div className="absolute w-56 h-56 rounded-full bg-indigo-500 opacity-10 blur-[80px] -bottom-10 -right-10 animate-pulse [animation-delay:1s]" />
        <div className="absolute w-40 h-40 rounded-full bg-amber-400 opacity-10 blur-[60px] bottom-20 left-10 animate-pulse [animation-delay:1.8s]" />

        {/* Orbit system */}
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 border-t-emerald-500 animate-spin [animation-duration:1.1s]" />
          <div className="absolute inset-4 rounded-full border border-indigo-500/20 border-t-indigo-500 animate-spin [animation-duration:1.8s] [animation-direction:reverse]" />
          <div className="absolute inset-8 rounded-full border border-amber-400/20 border-t-amber-400 animate-spin [animation-duration:2.6s]" />
          <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-emerald-500 shadow-[0_0_20px_#10b981aa] animate-pulse" />
        </div>

        {/* Label */}
        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="text-xs font-bold tracking-[0.22em] uppercase text-zinc-500 dark:text-zinc-300 font-serif animate-pulse">
            Loading
          </span>

          <div className="flex gap-1.5">
            {["bg-emerald-500", "bg-indigo-500", "bg-amber-400"].map(
              (color, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full ${color} animate-bounce`}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ),
            )}
          </div>

          <div className="mt-1 w-28 h-0.5 bg-zinc-300 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-16 rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500 animate-[progress_2s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
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
