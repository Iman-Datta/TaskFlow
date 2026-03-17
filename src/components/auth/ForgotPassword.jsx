import { useState, useRef } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { inputCls, primaryBtn, linkBtn } from "../../styles/auth";

const API = import.meta.env.VITE_API_URL;

function ForgotPassword({ onBackToLogin }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef([]);

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

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleVerifyOtp = () => {
    setError("");
    if (otp.join("").length < 6)
      return setError("Enter the full 6-digit code.");
    setStep(3);
  };

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

  const stepLabels = ["Email", "Verify", "Reset"];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Reset password
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          {step === 1 && "We'll send a 6-digit code to your email"}
          {step === 2 && `Code sent to ${email}`}
          {step === 3 && "Choose a strong new password"}
          {step === 4 && "You're all set"}
        </p>
      </div>

      {/* Progress steps */}
      {step < 4 && (
        <div className="flex items-center">
          {stepLabels.map((label, i) => {
            const num = i + 1;
            const done = step > num;
            const active = step === num;
            return (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-medium transition-all duration-200
                    ${
                      done
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : active
                          ? "bg-emerald-500 text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {done ? (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <polyline
                          points="2,6 5,9 10,3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      num
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wide
                    ${done || active ? "text-emerald-500" : "text-zinc-400"}`}
                  >
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-px mb-4 transition-colors duration-300
                    ${done ? "bg-emerald-400" : "bg-zinc-200 dark:bg-zinc-700"}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
              placeholder="you@example.com"
              autoFocus
              className={inputCls}
            />
          </div>
          <button
            onClick={handleSendOtp}
            disabled={loading || !email}
            className={primaryBtn}
          >
            {loading ? "Sending…" : "Send code"}
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-4">
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
                className="w-10 h-12 text-center text-lg font-semibold rounded-lg
                  bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700
                  text-zinc-900 dark:text-zinc-100
                  focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOtp}
            disabled={otp.join("").length < 6}
            className={primaryBtn}
          >
            Verify code
          </button>
          <div className="flex justify-between">
            <button
              onClick={() => {
                setStep(1);
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            >
              ← Change email
            </button>
            <button
              onClick={handleSendOtp}
              disabled={loading}
              className={linkBtn}
            >
              {loading ? "Sending…" : "Resend code"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5">
              New password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoFocus
                className={`${inputCls} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              >
                {showPw ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleResetPassword()}
              placeholder="Repeat password"
              className={inputCls}
            />
          </div>
          {pwHint && (
            <p
              className={`text-xs px-0.5 ${pwHint.ok ? "text-emerald-500" : "text-red-500"}`}
            >
              {pwHint.msg}
            </p>
          )}
          <button
            onClick={handleResetPassword}
            disabled={loading || !pwMatch || newPassword.length < 6}
            className={primaryBtn}
          >
            {loading ? "Updating…" : "Update password"}
          </button>
        </div>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <div className="text-center space-y-4 py-2">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
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
              Password updated
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              You can now sign in with your new password.
            </p>
          </div>
          <button
            onClick={onBackToLogin}
            className="w-full py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
          >
            Back to sign in
          </button>
        </div>
      )}

      {step < 4 && (
        <p className="text-center text-sm text-zinc-500">
          Remembered it?{" "}
          <button onClick={onBackToLogin} className={linkBtn}>
            Sign in
          </button>
        </p>
      )}
    </div>
  );
}

export default ForgotPassword;
