import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { clearUser, setAccessToken } from "../../features/auth/authSlice";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

const API = import.meta.env.VITE_API_URL;

export default function ProfileActions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [confirm, setConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await fetchWithAuth(
        `${API}/auth/logout`,
        { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } },
        dispatch,
        accessToken,
      );
    } catch {}
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-4">
        Account
      </p>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 overflow-hidden">
        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5
            border-b border-zinc-100 dark:border-zinc-800
            text-zinc-600 dark:text-zinc-400
            hover:bg-zinc-50 dark:hover:bg-zinc-800/40
            hover:text-zinc-900 dark:hover:text-zinc-100
            transition-all duration-150 group"
        >
          <div
            className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center
            group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors duration-150"
          >
            <LogOut size={14} />
          </div>
          <div className="text-left">
            <p className="text-[13px] font-medium">Sign out</p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-600">
              Log out of your account
            </p>
          </div>
        </button>

        {/* Delete account */}
        {!confirm ? (
          <button
            onClick={() => setConfirm(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5
              text-red-500 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-500/[0.06]
              transition-all duration-150 group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/[0.08] flex items-center justify-center">
              <Trash2 size={14} />
            </div>
            <div className="text-left">
              <p className="text-[13px] font-medium">Delete account</p>
              <p className="text-[11px] text-red-400/70 dark:text-red-500/60">
                Permanently remove your data
              </p>
            </div>
          </button>
        ) : (
          <div className="px-4 py-3.5">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle
                size={14}
                className="text-red-500 mt-0.5 flex-shrink-0"
              />
              <p className="text-[12px] text-zinc-600 dark:text-zinc-400">
                This will permanently delete your account and all data. This
                cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirm(false)}
                className="flex-1 h-8 rounded-lg text-[12px] font-medium
                  border border-zinc-200 dark:border-zinc-700
                  text-zinc-600 dark:text-zinc-400
                  hover:bg-zinc-50 dark:hover:bg-zinc-800
                  transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: wire to backend delete endpoint
                  dispatch(clearUser());
                  navigate("/");
                }}
                className="flex-1 h-8 rounded-lg text-[12px] font-medium
                  bg-red-500 hover:bg-red-600 text-white
                  transition-colors duration-150"
              >
                Yes, delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
