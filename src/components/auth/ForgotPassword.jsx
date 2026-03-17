import { useState, useRef } from "react";

const API = import.meta.env.VITE_API_URL;

function ForgotPassword({ onBackToLogin }) {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=reset, 4=done
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

  const inputBase =
    "w-full px-4 py-2.5 rounded-xl text-sm " +
    "bg-zinc-100 dark:bg-zinc-800 " +
    "border border-zinc-200 dark:border-zinc-700 " +
    "text-zinc-900 dark:text-zinc-100 " +
    "placeholder:text-zinc-400 dark:placeholder:text-zinc-500 " +
    "focus:outline-none focus:ring-2 focus:ring-emerald-500 transition";

  // ── Step 1 ──────────────────────────────────────────────
  const handleSendOtp = async () => {
    setError("");
    if (!email) return setError("Please enter your email.");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message || "Something went wrong.");
      setStep(2);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2 ──────────────────────────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // digits only
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = () => {
    setError("");
    const code = otp.join("");
    if (code.length < 6) return setError("Please enter the full 6-digit code.");
    setStep(3);
  };

  // ── Step 3 ──────────────────────────────────────────────
  const pwMatch =
    newPassword && confirmPassword && newPassword === confirmPassword;
  const pwHint = !newPassword
    ? null
    : newPassword.length < 6
      ? { msg: "At least 6 characters", ok: false }
      : confirmPassword && !pwMatch
        ? { msg: "Passwords do not match", ok: false }
        : pwMatch
          ? { msg: "Looks good", ok: true }
          : null;

  const handleResetPassword = async () => {
    setError("");
    if (!newPassword || !confirmPassword)
      return setError("Please fill both fields.");
    if (newPassword.length < 6)
      return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.join(""), newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 400) {
          setStep(2);
          setOtp(["", "", "", "", "", ""]);
        }
        return setError(data.message || "Something went wrong.");
      }
      setStep(4);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Progress bar ─────────────────────────────────────────
  const steps = ["Email", "Verify", "Reset"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Reset your password
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {step === 1 && "We'll send a code to your email"}
          {step === 2 && `Code sent to ${email}`}
          {step === 3 && "Choose a new password"}
          {step === 4 && "You're all set"}
        </p>
      </div>

      {/* Progress */}
      {step < 4 && (
        <div className="flex items-center">
          {steps.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all
                      ${
                        done || active
                          ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                      }`}
                  >
                    {done ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <polyline
                          points="2,6 5,9 10,3"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                  <span
                    className={`text-[11px] ${done || active ? "text-emerald-500 font-medium" : "text-zinc-400"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-px mb-4 transition-colors ${done ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 text-center bg-red-50 dark:bg-red-950/30 py-2 px-3 rounded-xl">
          {error}
        </p>
      )}

      {/* ── Step 1: Email ── */}
      {step === 1 && (
        <div className="space-y-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
            className={inputBase}
            autoFocus
          />
          <button
            onClick={handleSendOtp}
            disabled={loading || !email}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-medium transition"
          >
            {loading ? "Sending…" : "Send code"}
          </button>
        </div>
      )}

      {/* ── Step 2: OTP ── */}
      {step === 2 && (
        <div className="space-y-4">
          {/* 6 digit boxes */}
          <div className="flex gap-2 justify-center">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (otpRefs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                className="w-11 h-13 text-center text-xl font-semibold rounded-xl
                  bg-zinc-100 dark:bg-zinc-800
                  border border-zinc-200 dark:border-zinc-700
                  text-zinc-900 dark:text-zinc-100
                  focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={otp.join("").length < 6}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-medium transition"
          >
            Verify code
          </button>
          <div className="flex justify-between text-sm">
            <button
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="text-zinc-400 hover:text-zinc-300 transition"
            >
              ← Change email
            </button>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="text-emerald-500 hover:text-emerald-400 transition"
            >
              {loading ? "Sending…" : "Resend code"}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: New password ── */}
      {step === 3 && (
        <div className="space-y-3">
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputBase}
            autoFocus
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
            className={inputBase}
          />
          {pwHint && (
            <p
              className={`text-xs px-1 ${pwHint.ok ? "text-emerald-500" : "text-red-500"}`}
            >
              {pwHint.msg}
            </p>
          )}
          <button
            onClick={handleResetPassword}
            disabled={loading || !pwMatch || newPassword.length < 6}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-sm font-medium transition"
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </div>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mx-auto">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polyline
                points="4,12 9,17 20,6"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Password updated!
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              You can now sign in with your new password.
            </p>
          </div>
          <button
            onClick={onBackToLogin}
            className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            Back to login
          </button>
        </div>
      )}

      {/* Footer */}
      {step < 4 && (
        <p className="text-center text-sm text-zinc-500">
          Remembered it?{" "}
          <button
            onClick={onBackToLogin}
            className="text-emerald-500 hover:text-emerald-400 transition"
          >
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
