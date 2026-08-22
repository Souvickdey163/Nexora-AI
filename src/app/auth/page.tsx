"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NexoraLogo } from "@/components/common/Logo";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  KeyRound,
  Mail,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Lock,
} from "lucide-react";

type AuthMode = "login" | "signup" | "signup_otp" | "forgot_email" | "forgot_otp";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Fields (6 Digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Status & Feedback State
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // OTP Resend Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if ((mode === "signup_otp" || mode === "forgot_otp") && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  // Handle OTP digit change & auto-advance
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Move to next input if filled
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setResendTimer(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setNotification({
      type: "info",
      message: `A new 6-digit OTP verification code has been sent to ${email}.`,
    });
  };

  // OAuth Simulation Handlers
  const handleOAuthLogin = (provider: "Google" | "LinkedIn" | "GitHub") => {
    setLoading(true);
    setNotification({
      type: "info",
      message: `Authenticating with ${provider}... Redirecting to Nexora AI Dashboard.`,
    });
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  // Form Submission Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (mode === "login") {
      if (!email || !password) {
        setNotification({ type: "error", message: "Please enter your email and password." });
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setNotification({ type: "success", message: "Sign in successful! Redirecting..." });
        setTimeout(() => router.push("/dashboard"), 800);
      }, 1200);
    }

    if (mode === "signup") {
      if (!firstName || !lastName || !email || !password) {
        setNotification({ type: "error", message: "Please fill in all required fields." });
        return;
      }
      if (!agreeTerms) {
        setNotification({ type: "error", message: "Please accept the Terms of Service & Privacy Policy." });
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setMode("signup_otp");
        setResendTimer(30);
        setCanResend(false);
        setNotification({
          type: "info",
          message: `Verification OTP sent! Check your inbox at ${email}.`,
        });
      }, 1200);
    }

    if (mode === "signup_otp") {
      const fullOtp = otp.join("");
      if (fullOtp.length < 6) {
        setNotification({ type: "error", message: "Please enter the complete 6-digit OTP code." });
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setNotification({ type: "success", message: "Email verified successfully! Welcome to Nexora AI." });
        setTimeout(() => router.push("/dashboard"), 1000);
      }, 1200);
    }

    if (mode === "forgot_email") {
      if (!email) {
        setNotification({ type: "error", message: "Please enter your registered email address." });
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setMode("forgot_otp");
        setResendTimer(30);
        setCanResend(false);
        setNotification({
          type: "info",
          message: `Password reset OTP sent to ${email}.`,
        });
      }, 1200);
    }

    if (mode === "forgot_otp") {
      const fullOtp = otp.join("");
      if (fullOtp.length < 6) {
        setNotification({ type: "error", message: "Please enter the complete 6-digit OTP code." });
        return;
      }
      if (!password || password !== confirmPassword) {
        setNotification({ type: "error", message: "Passwords do not match or are empty." });
        return;
      }
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setNotification({ type: "success", message: "Password reset successful! Please sign in with your new password." });
        setTimeout(() => {
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setOtp(["", "", "", "", "", ""]);
        }, 1200);
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white">
      {/* Dynamic Background Glass Ambient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-tr from-sky-500/20 to-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-sky-500/5 via-indigo-500/5 to-cyan-400/5 blur-[160px] rounded-full pointer-events-none" />

      {/* Main Glassmorphic Auth Container Card */}
      <div className="relative w-full max-w-lg mx-auto bg-slate-900/90 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-sky-500/10 z-10 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <NexoraLogo size="lg" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {mode === "login" && "Job Seeker & Candidate Portal"}
              {mode === "signup" && "Create Your Nexora Account"}
              {mode === "signup_otp" && "Verify Email Address"}
              {mode === "forgot_email" && "Reset Password"}
              {mode === "forgot_otp" && "Set New Password"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {mode === "login" && "Access your AI career copilot, resume ATS score, and mock interviews."}
              {mode === "signup" && "Start your AI-powered career journey with targeted placement tools."}
              {mode === "signup_otp" && `Enter the 6-digit OTP code sent to ${email}`}
              {mode === "forgot_email" && "We'll send a 6-digit OTP code to verify your identity."}
              {mode === "forgot_otp" && "Enter the OTP code and set your new account password."}
            </p>
          </div>
        </div>

        {/* Tab Switcher (Only visible for Login / Sign Up modes) */}
        {(mode === "login" || mode === "signup") && (
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 mb-8">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setNotification(null);
              }}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                mode === "login"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setNotification(null);
              }}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                mode === "signup"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Notification Toast Alert */}
        {notification && (
          <div
            className={`p-4 rounded-2xl mb-6 border text-xs sm:text-sm font-medium flex items-start gap-3 transition-all ${
              notification.type === "error"
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                : notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-sky-500/10 border-sky-500/30 text-sky-300"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            ) : notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 shrink-0 text-sky-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{notification.message}</span>
          </div>
        )}

        {/* OAuth Buttons (Google, LinkedIn, GitHub - for Login & Sign Up) */}
        {(mode === "login" || mode === "signup") && (
          <div className="space-y-3 mb-8">
            {/* Google OAuth */}
            <button
              type="button"
              onClick={() => handleOAuthLogin("Google")}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-700/80 text-white font-semibold text-xs sm:text-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-sky-500/50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{mode === "login" ? "Continue with Google" : "Sign up with Google"}</span>
            </button>

            {/* LinkedIn & GitHub OAuth Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* LinkedIn */}
              <button
                type="button"
                onClick={() => handleOAuthLogin("LinkedIn")}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-700/80 text-white font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" />
                </svg>
                <span>LinkedIn</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                onClick={() => handleOAuthLogin("GitHub")}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-700/80 text-white font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center pt-2">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest absolute">
                OR
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* LOGIN & SIGN UP COMMON / SPECIFIC FIELDS */}
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  First Name <span className="text-sky-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Last Name <span className="text-sky-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
              </div>
            </div>
          )}

          {(mode === "login" || mode === "signup" || mode === "forgot_email") && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-sky-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          )}

          {(mode === "login" || mode === "signup" || mode === "forgot_otp") && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  {mode === "forgot_otp" ? "New Password" : "Password"}{" "}
                  <span className="text-sky-500">*</span>
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot_email");
                      setNotification(null);
                    }}
                    className="text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {mode === "forgot_otp" && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password <span className="text-sky-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* OTP INPUTS (Used for Signup OTP & Forgot Password OTP) */}
          {(mode === "signup_otp" || mode === "forgot_otp") && (
            <div className="space-y-4 py-2">
              <label className="block text-xs font-semibold text-slate-300 text-center">
                Enter 6-Digit Verification OTP Code <span className="text-sky-500">*</span>
              </label>

              {/* 6 Digit OTP Inputs */}
              <div className="flex items-center justify-center gap-2.5">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  />
                ))}
              </div>

              {/* Resend Timer & Button */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <span>Didn&apos;t receive code?</span>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Resend OTP Code</span>
                  </button>
                ) : (
                  <span className="font-semibold text-slate-500">
                    Resend in <strong className="text-sky-400">{resendTimer}s</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* CHECKBOXES */}
          {mode === "login" && (
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500/50"
                />
                <span>Remember me for 30 days</span>
              </label>
            </div>
          )}

          {mode === "signup" && (
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 leading-normal">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-sky-500/50 mt-0.5"
                />
                <span>
                  By signing up, I agree to the{" "}
                  <Link href="/contact" className="text-sky-400 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/contact" className="text-sky-400 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-sky-500 hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-sky-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span>
                    {mode === "login" && "Sign In to Nexora AI"}
                    {mode === "signup" && "Send Verification OTP"}
                    {mode === "signup_otp" && "Verify Email & Complete Sign Up"}
                    {mode === "forgot_email" && "Send Password Reset OTP"}
                    {mode === "forgot_otp" && "Reset Password & Login"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* BACK TO LOGIN BUTTON FOR OTP / FORGOT FLOWS */}
          {(mode === "signup_otp" || mode === "forgot_email" || mode === "forgot_otp") && (
            <div className="text-center pt-3">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setNotification(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          )}
        </form>

        {/* Footer Sub-Links */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center space-y-2">
          <p className="text-xs text-slate-500">
            Looking for company recruitment or enterprise coach access?{" "}
            <Link href="/contact" className="text-sky-400 hover:underline font-medium">
              Contact Enterprise Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

