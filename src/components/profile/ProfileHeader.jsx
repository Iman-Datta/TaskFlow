import { useSelector } from "react-redux";
import { Camera } from "lucide-react";

export default function ProfileHeader() {
  const user = useSelector((state) => state.auth.user);

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
    <div className="flex flex-col items-center text-center pb-8 mb-8 border-b border-zinc-200 dark:border-zinc-800">
      {/* Avatar */}
      <div className="relative mb-5">
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold
            bg-emerald-500/10 dark:bg-emerald-500/[0.08]
            border border-emerald-500/20 dark:border-emerald-500/15
            text-emerald-600 dark:text-emerald-400
            select-none"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="avatar"
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            getInitials()
          )}
        </div>
        <button
          className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg
            bg-white dark:bg-zinc-900
            border border-zinc-200 dark:border-zinc-700
            flex items-center justify-center
            text-zinc-400 dark:text-zinc-500
            hover:text-emerald-500 dark:hover:text-emerald-400
            hover:border-emerald-300 dark:hover:border-emerald-700
            transition-all duration-150 shadow-sm"
          title="Change photo (coming soon)"
        >
          <Camera size={13} />
        </button>
      </div>

      {/* Name & email */}
      <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
        {user?.name || "Your Name"}
      </h2>
      <p className="text-[13px] text-zinc-500 dark:text-zinc-500">
        {user?.email || "your@email.com"}
      </p>

      {/* Joined badge */}
      {user?.createdAt && (
        <div
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full
          bg-zinc-100 dark:bg-zinc-800/60
          border border-zinc-200 dark:border-zinc-700/60
          text-[11px] font-medium text-zinc-400 dark:text-zinc-500"
        >
          <span className="w-1 h-1 rounded-full bg-emerald-500" />
          Joined{" "}
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </div>
      )}
    </div>
  );
}
