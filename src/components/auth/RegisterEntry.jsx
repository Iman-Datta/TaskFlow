import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const API = import.meta.env.VITE_API_URL;

function RegisterEntry({ onLogin, onRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const inputStyle = `
    w-full
    bg-white border border-zinc-300
    dark:bg-zinc-900 dark:border-zinc-800
    px-4 py-2.5 rounded-xl
    text-zinc-900 placeholder:text-zinc-500
    dark:text-zinc-100 dark:placeholder:text-zinc-500
    focus:outline-none focus:ring-2 focus:ring-emerald-500
    transition
  `;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await onRegister(formData.email, formData.password);
  };

  const handleGoogleLogin = () => {
    const url = `${API}/auth/google`;
    window.location.href = url;
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-6 text-zinc-900 dark:text-zinc-100">
        Create Account
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className={inputStyle}
        />
        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={inputStyle}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {showPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>

        <div className="relative">
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${inputStyle} pr-10`}
          />

          <button
            type="button"
            onClick={() => setConfirmShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible size={20} />
            ) : (
              <AiOutlineEye size={20} />
            )}
          </button>
        </div>

        <button
          type="submit"
          className="
            w-full
            bg-zinc-200 hover:bg-zinc-300
            dark:bg-zinc-800 dark:hover:bg-zinc-700
            text-zinc-900 dark:text-white
            py-2.5 rounded-xl font-medium
            shadow-sm shadow-black/10
            dark:shadow-black/30
            transition
          ">
          Create Account
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800"></div>
        <span className="px-3 text-sm text-zinc-500">OR</span>
        <div className="flex-1 h-px bg-zinc-300 dark:bg-zinc-800"></div>
      </div>

      <button
        type="button"
        className="
    w-full
    bg-white border border-zinc-300
    dark:bg-zinc-900 dark:border-zinc-800
    py-2.5 rounded-xl
    flex items-center justify-center gap-3
    hover:bg-zinc-100
    dark:hover:bg-zinc-800
    transition
  "
        onClick={handleGoogleLogin}>
        <FcGoogle size={20} />

        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          Continue with Google
        </span>
      </button>

      <p className="text-center text-sm text-zinc-500 mt-6">
        Already have an account?{" "}
        <button
          onClick={onLogin}
          className="text-emerald-500 hover:text-emerald-400 transition">
          Login
        </button>
      </p>
    </>
  );
}

export default RegisterEntry;
