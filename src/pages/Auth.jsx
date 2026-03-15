import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Login from "../components/auth/Login";
import RegisterEntry from "../components/auth/RegisterEntry";
import ForgotPassword from "../components/auth/ForgotPassword";

import { setUser } from "../features/auth/authSlice";

const API = import.meta.env.VITE_API_URL;

function Auth() {
  const [view, setView] = useState("login");
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const registerUser = async (email, password, name) => {
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        // if account already exists
        if (res.status === 409) {
          navigate("/auth");
          return;
        }
        throw new Error(data.message || "Registration failed");
      }
      // Redirect to check email page
      navigate("/checkEmail", {
        state: { email },
      });
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

      const data = await res.json();

      if (!res.ok) {
        // email not verified
        if (res.status === 403) {
          navigate("/checkEmail", {
            state: { email },
          });
          return;
        }

        throw new Error(data.message || "Failed to login");
      }
      
      const me = await fetch(`${API}/auth/me`, {
        credentials: "include",
      });

      const userData = await me.json();

      dispatch(setUser(userData.user));
      navigate("/task");

      return userData;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div
      className="
      min-h-screen flex items-center justify-center px-4
      bg-zinc-100 dark:bg-zinc-950
      transition-colors duration-300
    "
    >
      <div
        className="
        w-full max-w-md
        bg-white border border-zinc-200
        dark:bg-zinc-900 dark:border-zinc-800
        p-8 rounded-2xl
        shadow-xl shadow-black/10
        dark:shadow-black/40
        transition-colors duration-300
      "
      >
        {view === "login" && (
          <Login
            onRegister={() => setView("register")}
            onLogin={loginUser}
            onForgot={() => setView("forgot")}
            onLoginSuccess={() => {
              console.log("Login success");
            }}
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
  );
}

export default Auth;
