import { useState } from "react";
import {
  Stethoscope, AlertTriangle, Mail, KeyRound, Eye, EyeOff, ChevronRight, Loader2
} from "lucide-react";
import { ROLES } from "../data/roles";
import { DEMO_PASSWORD } from "../data/staff";
import { APP_NAME } from "../constants/appMeta";
import { sanitizeText } from "../utils/security";

export default function LoginScreen({ staff, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePassword(value) {
    return value.length >= 4;
  }

  function handleEmailChange(value) {
    const safeValue = sanitizeText(value);
    setEmail(safeValue);
    if (!safeValue.trim()) {
      setEmailError("Please enter your email address.");
    } else if (!validateEmail(value.trim())) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }

  function handlePasswordChange(value) {
    const safeValue = sanitizeText(value);
    setPassword(safeValue);
    if (!safeValue.trim()) {
      setPasswordError("Please enter your password.");
    } else if (!validatePassword(value.trim())) {
      setPasswordError("Password must be at least 4 characters long.");
    } else {
      setPasswordError("");
    }
  }

  function fillDemo(acct) {
    setEmail(acct.email);
    setPassword(DEMO_PASSWORD);
    setError("");
    setEmailError("");
    setPasswordError("");
  }

  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const normalized = sanitizeText(email).trim().toLowerCase();
    const enteredPassword = sanitizeText(password).trim();

    const nextEmailError = !normalized ? "Please enter your email address." : !validateEmail(normalized) ? "Please enter a valid email address." : "";
    const nextPasswordError = !enteredPassword ? "Please enter your password." : !validatePassword(enteredPassword) ? "Password must be at least 4 characters long." : "";

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextEmailError || nextPasswordError) {
      setError("Please correct the highlighted fields.");
      return;
    }

    const record = staff.find(s => s.email === normalized);
    if (!record || enteredPassword !== DEMO_PASSWORD) {
      setError("Incorrect email or password. Try one of the demo accounts below.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      onLogin(record);
    }, 600);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSubmit(e);
  }

  return (
    <div className="min-h-screen w-full bg-slate-50 text-slate-900 flex items-center justify-center px-3 py-6 sm:px-4 sm:py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center shrink-0">
            <Stethoscope className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-brand font-bold text-2xl text-teal-900">{APP_NAME}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7">
          <h1 className="font-brand text-lg text-slate-800 mb-1">Sign in to your practice</h1>
          <p className="text-xs text-slate-500 mb-5">Access is scoped to your role — clinical query, document management, or compliance oversight.</p>

          <div className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 ${emailError ? "border-rose-300 bg-rose-50/40" : "border-slate-300"}`}>
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input type="email" value={email} onChange={e => handleEmailChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="you@documed.clinic"
                  className="flex-1 py-2.5 text-sm outline-none bg-transparent" disabled={isSubmitting} />
              </div>
              {emailError && <p className="mt-1.5 text-[11px] text-rose-600">{emailError}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
              <div className={`flex items-center gap-2 border rounded-lg px-3 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 ${passwordError ? "border-rose-300 bg-rose-50/40" : "border-slate-300"}`}>
                <KeyRound className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => handlePasswordChange(e.target.value)} onKeyDown={handleKeyDown} placeholder="••••••••"
                  className="flex-1 py-2.5 text-sm outline-none bg-transparent" disabled={isSubmitting} />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="text-slate-400 hover:text-slate-600 shrink-0" disabled={isSubmitting}>
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-[11px] text-rose-600">{passwordError}</p>}
            </div>

            {error && (
              <div className="flex items-start gap-1.5 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 anim-rise">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="mt-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg py-2.5 text-sm font-semibold flex items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : "Sign in"}
            </button>
          </div>
        </div>

        <div className="mt-5 bg-white border border-dashed border-slate-300 rounded-2xl p-4">
          <p className="font-data text-[10px] uppercase tracking-wide text-slate-400 mb-2.5">Demo accounts (password: {DEMO_PASSWORD})</p>
          <div className="flex flex-col gap-1.5">
            {staff.map(acct => (
              <button key={acct.email} type="button" onClick={() => fillDemo(acct)}
                className="flex items-center justify-between gap-2 text-left border border-slate-200 hover:border-teal-500 hover:bg-teal-50 rounded-lg px-3 py-2 transition">
                <div>
                  <div className="text-xs font-semibold text-slate-700">{acct.name} <span className="text-slate-400 font-normal">· {ROLES[acct.role].label}</span></div>
                  <div className="font-data text-[10px] text-slate-400">{acct.email}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </button>
            ))}
          </div>
          <p className="text-[10.5px] text-slate-400 mt-2.5 leading-relaxed">Click an account to fill the form, then sign in — this simulates a real login rather than bypassing it. Roles shown here reflect any changes made in the Team tab.</p>
        </div>
      </div>
    </div>
  );
}
