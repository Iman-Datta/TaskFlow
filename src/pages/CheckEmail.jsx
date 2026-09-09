import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="2"
        y="4"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M2 6.5L10 11.5L18 6.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AtIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M4.5 7C4.5 5.619 5.619 4.5 7 4.5C8.381 4.5 9.5 5.619 9.5 7C9.5 8.381 8.381 9.5 7 9.5"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <circle cx="7" cy="7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function CheckEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [resendState, setResendState] = useState("idle"); // "idle" | "sent" | "cooldown"
  const [cooldown, setCooldown] = useState(0);

  const API = import.meta.env.VITE_API_URL;

  const handleResend = async () => {
    if (resendState !== "idle") return;

    try {
      const res = await fetch(`${API}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setResendState("sent");
      setCooldown(30);

      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setResendState("idle");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
    }
  };

  const resendLabel =
    resendState === "sent"
      ? "Link sent"
      : resendState === "cooldown" || cooldown > 0
        ? `Resend in ${cooldown}s`
        : "Resend link";

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 dark:bg-zinc-950 px-4">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-0.5 bg-zinc-900 dark:bg-zinc-100" />

          {/* Body */}
          <div className="px-8 pt-9 pb-7">
            {/* Icon */}
            <div className="w-11 h-11 flex items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 mb-7">
              <MailIcon />
            </div>

            {/* Heading */}
            <h1 className="text-[19px] font-medium tracking-tight text-zinc-900 dark:text-zinc-50 mb-1.5">
              Check your inbox
            </h1>

            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
              We sent a sign-in link to
            </p>

            {/* Email pill */}
            <div className="flex items-center gap-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3.5 py-2.5 mb-5 text-zinc-500 dark:text-zinc-400">
              <AtIcon />
              <span className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200 break-all tracking-wide">
                {email || "your email address"}
              </span>
            </div>

            <p className="text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed mb-7">
              Click the link in that email to sign in. The link expires in{" "}
              <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                10 minutes
              </span>{" "}
              and can only be used once.
            </p>

            {/* Actions */}
            <div className="flex flex-col gap-2.5">
              <a
                href="https://mail.google.com/mail/u/0/#inbox"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:hover:bg-zinc-300 dark:text-zinc-900 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Open email app
              </a>

              <button
                onClick={handleResend}
                disabled={resendState !== "idle"}
                className={`w-full text-sm py-2.5 rounded-lg border transition-colors
                  ${
                    resendState === "sent"
                      ? "border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 bg-transparent"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 bg-transparent"
                  }
                  disabled:cursor-default`}
              >
                {resendLabel}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 px-8 py-3.5 flex items-center justify-between">
            <span className="text-xs text-zinc-400 dark:text-zinc-500">
              Wrong email?
            </span>
            <button
              onClick={() => navigate("/auth")}
              className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline underline-offset-2 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              Use a different address
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-zinc-400 dark:text-zinc-600 mt-5">
          DoTo &mdash; by Iman Datta
        </p>
      </div>
    </div>
  );
}

export default CheckEmail;
