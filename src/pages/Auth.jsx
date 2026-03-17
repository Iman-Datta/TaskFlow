import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login";
import RegisterEntry from "../components/auth/RegisterEntry";
import ForgotPassword from "../components/auth/ForgotPassword";
import { setUser, setAccessToken } from "../features/auth/authSlice";

const API = import.meta.env.VITE_API_URL;

function Auth() {
  const [view, setView] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerUser = async (email, password) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) {
          navigate("/auth");
          return;
        }
        throw new Error(data.message || "Registration failed");
      }
      navigate("/checkEmail", { state: { email } });
    } catch (error) {
      console.error(error);
    }
  };

  const loginUser = async (email, password) => {
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!res.ok && res.status === 403) {
        navigate("/checkEmail", { state: { email } });
        return;
      }
      const data = await res.json();
      const token = data.accessToken;
      if (!token) throw new Error(data.message || "Failed to login");
      dispatch(setAccessToken(token));
      const me = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const userData = await me.json();
      dispatch(setUser(userData.user));
      navigate("/task");
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-[680px] flex rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-black/40">
        {/* ── Left branding panel ── */}
        <div className="hidden md:flex flex-col justify-between w-[220px] flex-shrink-0 bg-zinc-900 dark:bg-zinc-950 p-8 border-r border-zinc-800">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-6 h-6 bg-emerald-500 rounded-md flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <polyline
                    points="2,6 5,9.5 10,2.5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-medium text-zinc-100 tracking-tight">
                TaskFlow
              </span>
            </div>
            <p className="text-zinc-400 text-[13px] leading-relaxed">
              <span className="block text-zinc-300 font-medium mb-1">
                Stay in flow.
              </span>
              Organize tasks, hit deadlines, and ship without the noise.
            </p>
          </div>
          <p className="text-zinc-600 text-xs">Built by Iman Datta</p>
        </div>

        {/* ── Right form panel ── */}
        <div className="flex-1 bg-white dark:bg-zinc-900 p-8">
          <div
            key={view}
            className="animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {view === "login" && (
              <Login
                onLogin={loginUser}
                onRegister={() => setView("register")}
                onForgot={() => setView("forgot")}
              />
            )}
            {view === "register" && (
              <RegisterEntry
                onLogin={() => setView("login")}
                onRegister={registerUser}
              />
            )}
            {view === "forgot" && (
              <ForgotPassword onBackToLogin={() => setView("login")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
