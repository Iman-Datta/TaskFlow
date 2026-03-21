import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileStats from "../components/profile/ProfileStats";
import ProfileSettings from "../components/profile/ProfileSettings";
import ProfileActions from "../components/profile/ProfileActions";

export default function Profile() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 transition-colors duration-300 pt-24 pb-16 px-4">
      <div className="max-w-lg mx-auto">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Profile
          </h1>
          <p className="text-[13px] text-zinc-500 dark:text-zinc-500 mt-1">
            Manage your account and preferences
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6
            bg-white dark:bg-zinc-900/60
            border border-zinc-200/80 dark:border-zinc-800/60
            shadow-sm dark:shadow-none"
        >
          <ProfileHeader />
          <ProfileStats />
          <ProfileSettings />
          <ProfileActions />
        </div>
      </div>
    </div>
  );
}