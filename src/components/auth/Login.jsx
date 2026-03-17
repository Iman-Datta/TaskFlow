import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  inputCls,
  primaryBtn,
  ghostBtn,
  labelCls,
  linkBtn,
} from "../../styles/auth";

const API = import.meta.env.VITE_API_URL;

function Login({ onLogin, onRegister, onForgot }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(formData.email, formData.password);
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Welcome back
        </h2>
        <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
      </div>

      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={18} />
              ) : (
                <AiOutlineEye size={18} />
              )}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
        <span className="text-xs text-zinc-400">or</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
      </div>

      <button
        type="button"
        className={ghostBtn}
        onClick={() => {
          window.location.href = `${API}/auth/google`;
        }}
      >
        <FcGoogle size={18} />
        Continue with Google
      </button>

      <div className="text-center space-y-2 pt-1">
        <p className="text-sm text-zinc-500">
          No account?{" "}
          <button onClick={onRegister} className={linkBtn}>
            Create one
          </button>
        </p>
        <button onClick={onForgot} className={linkBtn}>
          Forgot password?
        </button>
      </div>
    </div>
  );
}

export default Login;
