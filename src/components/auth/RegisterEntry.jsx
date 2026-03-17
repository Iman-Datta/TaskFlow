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

function RegisterEntry({ onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ pw: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords do not match.");
    if (formData.password.length < 6)
      return setError("Password must be at least 6 characters.");
    setLoading(true);
    try {
      await onRegister(formData.email, formData.password);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeBtn = ({ field }) => (
    <button
      type="button"
      onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
    >
      {show[field] ? (
        <AiOutlineEyeInvisible size={18} />
      ) : (
        <AiOutlineEye size={18} />
      )}
    </button>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Create account
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Free forever. No credit card.
        </p>
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
              type={show.pw ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              className={`${inputCls} pr-10`}
            />
            <EyeBtn field="pw" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Confirm password</label>
          <div className="relative">
            <input
              type={show.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat password"
              className={`${inputCls} pr-10`}
            />
            <EyeBtn field="confirm" />
          </div>
        </div>

        <button type="submit" disabled={loading} className={primaryBtn}>
          {loading ? "Creating account…" : "Create account"}
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

      <p className="text-center text-sm text-zinc-500 pt-1">
        Already have an account?{" "}
        <button onClick={onLogin} className={linkBtn}>
          Sign in
        </button>
      </p>
    </div>
  );
}

export default RegisterEntry;
