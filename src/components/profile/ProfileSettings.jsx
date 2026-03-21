import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Moon, Sun, Lock, ChevronDown } from "lucide-react";
import { setTheme } from "../../features/theme/themeSlice";

export default function ProfileSettings() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

  const [pwOpen, setPwOpen] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ current: "", newPw: "", confirm: "" });
  const [msg, setMsg] = useState(null);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    dispatch(setTheme(next));
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const handlePwSubmit = (e) => {
    e.preventDefault();
    if (form.newPw !== form.confirm) {
      setMsg({ type: "error", text: "New passwords don't match." });
      return;
    }
    if (form.newPw.length < 8) {
      setMsg({
        type: "error",
        text: "Password must be at least 8 characters.",
      });
      return;
    }
    // TODO: wire to backend
    setMsg({
      type: "success",
      text: "Password updated! (backend not wired yet)",
    });
    setForm({ current: "", newPw: "", confirm: "" });
  };

  const inputCls = `w-full h-10 pl-3 pr-10 rounded-lg text-[13px]
    bg-zinc-50 dark:bg-zinc-800/60
    border border-zinc-200 dark:border-zinc-700/60
    text-zinc-900 dark:text-zinc-100
    placeholder:text-zinc-400 dark:placeholder:text-zinc-600
    focus:outline-none focus:border-emerald-400 dark:focus:border-emerald-600
    transition-colors duration-150`;

  return (
    <div className="mb-8">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">
        Settings
      </p>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 overflow-hidden">
        {/* Theme toggle */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
            </div>
            <div>
              <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                Appearance
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600 capitalize">
                {theme} mode
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 flex items-center
              ${theme === "dark" ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"}`}
            style={{ height: 22, width: 40 }}
          >
            <span
              className={`absolute w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200
                ${theme === "dark" ? "translate-x-5" : "translate-x-1"}`}
            />
          </button>
        </div>

        {/* Change password accordion */}
        <button
          onClick={() => {
            setPwOpen((p) => !p);
            setMsg(null);
          }}
          className="w-full flex items-center justify-between px-4 py-3.5 text-left
            hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors duration-150"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400">
              <Lock size={14} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-zinc-900 dark:text-zinc-100">
                Change password
              </p>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
                Update your password
              </p>
            </div>
          </div>
          <ChevronDown
            size={15}
            className={`text-zinc-400 transition-transform duration-200 ${pwOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Password form */}
        {pwOpen && (
          <div className="px-4 pb-4 border-t border-zinc-100 dark:border-zinc-800">
            <form
              onSubmit={handlePwSubmit}
              className="pt-4 flex flex-col gap-3"
            >
              {[
                {
                  id: "current",
                  label: "Current password",
                  show: showCurrent,
                  toggle: () => setShowCurrent((p) => !p),
                },
                {
                  id: "newPw",
                  label: "New password",
                  show: showNew,
                  toggle: () => setShowNew((p) => !p),
                },
                {
                  id: "confirm",
                  label: "Confirm new",
                  show: showConfirm,
                  toggle: () => setShowConfirm((p) => !p),
                },
              ].map(({ id, label, show, toggle }) => (
                <div key={id}>
                  <label className="block text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      type={show ? "text" : "password"}
                      className={inputCls}
                      placeholder="••••••••"
                      value={form[id]}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [id]: e.target.value }))
                      }
                    />
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      {show ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              ))}

              {msg && (
                <p
                  className={`text-[12px] font-medium ${msg.type === "error" ? "text-red-500" : "text-emerald-500"}`}
                >
                  {msg.text}
                </p>
              )}

              <button
                type="submit"
                className="h-9 px-4 rounded-lg text-[13px] font-medium
                  bg-emerald-600 hover:bg-emerald-500 text-white
                  transition-colors duration-150 mt-1"
              >
                Update password
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
