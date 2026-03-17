import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  Trash2,
  CheckCircle,
  Moon,
  Sun,
  Info,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

import { clearUser } from "../features/auth/authSlice";
import { setTheme } from "../features/theme/themeSlice";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API = import.meta.env.VITE_API_URL;

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const theme = useSelector((state) => state.theme.theme);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const logoutUser = async () => {
    setDropdownOpen(false);
    try {
      const res = await fetchWithAuth(
        `${API}/auth/logout`,
        { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } },
        dispatch,
        accessToken,
      );
      if (!res?.ok) throw new Error("Failed to logout");
      dispatch(clearUser());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    dispatch(setTheme(next));
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  // Avatar initials from user name or email
  const getInitials = () => {
    if (!user) return "?";
    if (user.name) {
      const parts = user.name.trim().split(" ");
      return parts.length >= 2
        ? (parts[0][0] + parts[1][0]).toUpperCase()
        : parts[0][0].toUpperCase();
    }
    return user.email?.[0].toUpperCase() || "U";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 pt-3">
        <div
          className="
          h-[66px] flex items-center justify-between px-6
          rounded-2xl
          bg-white/60 dark:bg-zinc-950/60
          border border-zinc-200/60 dark:border-zinc-700/40
          backdrop-blur-[20px] saturate-[180%]
          shadow-xl shadow-black/[0.06] dark:shadow-black/40
          dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
          transition-all duration-300
        "
        >
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            <div className="relative w-8 h-8 flex-shrink-0">
              {/* Outer ring */}
              <div
                className="absolute inset-0 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/[0.12]
                border border-emerald-500/20 dark:border-emerald-500/20
                group-hover:bg-emerald-500/15 transition-all duration-300"
              />
              {/* Icon */}
              <svg viewBox="0 0 32 32" className="relative w-8 h-8" fill="none">
                <path
                  d="M10 16H22M16 10V22"
                  stroke="#10b981"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  className="transition-all duration-500 group-hover:stroke-emerald-400"
                />
                <circle
                  cx="16"
                  cy="16"
                  r="2.5"
                  fill="#10b981"
                  fillOpacity="0.6"
                  className="transition-all duration-500 group-hover:fill-opacity-90"
                />
              </svg>
            </div>
            <span className="text-[17px] font-bold tracking-tight leading-none">
              <span className="text-zinc-900 dark:text-zinc-100">Task</span>
              <span className="text-emerald-500">Flow</span>
            </span>
          </Link>

          {/* ── Center nav ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {user && (
              <>
                <Link
                  to="/completed"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium
                    text-zinc-500 dark:text-zinc-400
                    hover:text-zinc-900 dark:hover:text-zinc-100
                    hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60
                    transition-all duration-150"
                >
                  <CheckCircle size={14} /> Completed
                </Link>
                <Link
                  to="/trash"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium
                    text-zinc-500 dark:text-zinc-400
                    hover:text-zinc-900 dark:hover:text-zinc-100
                    hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60
                    transition-all duration-150"
                >
                  <Trash2 size={14} /> Trash
                </Link>
              </>
            )}
            <Link
              to="/about"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium
                text-zinc-500 dark:text-zinc-400
                hover:text-zinc-900 dark:hover:text-zinc-100
                hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60
                transition-all duration-150"
            >
              <Info size={14} /> About
            </Link>
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-1.5">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-[34px] h-[34px] rounded-lg flex items-center justify-center
                text-zinc-400 dark:text-zinc-500
                hover:text-zinc-700 dark:hover:text-zinc-200
                hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60
                transition-all duration-150"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            <div className="w-px h-[18px] mx-1 bg-zinc-200 dark:bg-zinc-700/60" />

            {/* CTA */}
            <Link
              to="/task"
              className="h-[34px] px-4 rounded-lg text-[13px] font-medium
                border border-emerald-500/30 dark:border-emerald-500/20
                bg-emerald-500/[0.08] dark:bg-emerald-500/[0.06]
                text-emerald-700 dark:text-emerald-400
                hover:bg-emerald-500/[0.14] dark:hover:bg-emerald-500/[0.12]
                hover:border-emerald-500/50
                flex items-center
                transition-all duration-150"
            >
              {user ? "My Tasks" : "Get Started"}
            </Link>

            {/* ── Logged out: Sign in ── */}
            {!user && (
              <Link
                to="/auth"
                className="relative h-[34px] px-3 flex items-center text-[13px] font-medium
                  text-zinc-500 dark:text-zinc-400
                  hover:text-zinc-900 dark:hover:text-zinc-100
                  after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-0.5
                  after:h-[1.5px] after:w-0 after:bg-emerald-500
                  after:transition-all after:duration-250
                  hover:after:w-[65%]
                  transition-all duration-150"
              >
                Sign in
              </Link>
            )}

            {/* ── Logged in: Avatar + Dropdown ── */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 pl-1 pr-2 h-[34px] rounded-lg
                    hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60
                    transition-all duration-150 group"
                >
                  {/* Avatar circle */}
                  <div
                    className="w-[26px] h-[26px] rounded-full flex-shrink-0
                    bg-emerald-500/15 dark:bg-emerald-500/10
                    border border-emerald-500/25 dark:border-emerald-500/20
                    flex items-center justify-center
                    text-[11px] font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    {getInitials()}
                  </div>
                  <ChevronDown
                    size={13}
                    className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-200
                      ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    className="
                    absolute right-0 top-[calc(100%+8px)]
                    w-[200px]
                    bg-white/90 dark:bg-zinc-900/90
                    backdrop-blur-xl
                    border border-zinc-200/70 dark:border-zinc-700/50
                    rounded-xl
                    shadow-xl shadow-black/10 dark:shadow-black/40
                    overflow-hidden
                    animate-in fade-in slide-in-from-top-1 duration-150
                  "
                  >
                    {/* User info header */}
                    <div className="px-3 py-2.5 border-b border-zinc-100 dark:border-zinc-800">
                      <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Menu items */}
                    <div className="p-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg
                          text-[13px] font-medium
                          text-zinc-700 dark:text-zinc-300
                          hover:bg-zinc-100 dark:hover:bg-zinc-800
                          hover:text-zinc-900 dark:hover:text-zinc-100
                          transition-all duration-150"
                      >
                        <User
                          size={14}
                          className="text-zinc-400 dark:text-zinc-500"
                        />
                        Profile
                      </Link>

                      <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                      <button
                        onClick={logoutUser}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg
                          text-[13px] font-medium
                          text-red-500 dark:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-500/[0.08]
                          transition-all duration-150"
                      >
                        <LogOut size={14} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
