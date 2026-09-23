"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NexoraLogo } from "@/components/common/Logo";
import { authApi } from "@/lib/api/auth";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import { AuthHeader } from "./AuthHeader";
import { OAuthButtons } from "./OAuthButtons";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { OtpVerificationForm } from "./OtpVerificationForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export type AuthMode = "login" | "signup" | "signup_otp" | "forgot_email" | "forgot_otp";

export function AuthPageClient() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Fields (6 Digits)
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState(60);
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

  const handleResendOtp = async () => {
    setLoading(true);
    const res = await authApi.resendOtp(email);
    setLoading(false);
    if (res.success) {
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      setNotification({
        type: "info",
        message: res.message || `A new 6-digit OTP verification code has been sent to ${email}.`,
      });
    } else {
      setNotification({ type: "error", message: res.error || "Failed to resend OTP code." });
    }
  };

  // OAuth Handlers - Redirect to Real Backend OAuth Endpoints
  const handleOAuthLogin = (provider: "Google" | "LinkedIn" | "GitHub") => {
    const providerKey = provider.toLowerCase() as "google" | "github" | "linkedin";
    setLoading(true);
    setNotification({
      type: "info",
      message: `Connecting to ${provider}... Redirecting to OAuth server.`,
    });
    window.location.href = authApi.getOAuthRedirectUrl(providerKey);
  };

  // Helper to extract detailed validation error messages from API response
  const getErrorMessage = (res: any, fallback: string): string => {
    if (res?.errors && typeof res.errors === "object") {
      const messages: string[] = [];
      Object.entries(res.errors).forEach(([_, errList]) => {
        if (Array.isArray(errList)) {
          messages.push(...errList);
        } else if (typeof errList === "string") {
          messages.push(errList);
        }
      });
      if (messages.length > 0) {
        return messages.join(". ");
      }
    }
    if (res?.error && res.error !== "Validation failed") {
      return res.error;
    }
    return fallback;
  };

  // Real Form Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    if (mode === "login") {
      const trimmedEmail = email.trim();
      if (!trimmedEmail || !password) {
        setNotification({ type: "error", message: "Please enter your email and password." });
        return;
      }
      setLoading(true);
      const res = await authApi.login({ email: trimmedEmail, password });
      setLoading(false);

      if (res.success) {
        setNotification({ type: "success", message: res.message || "Sign in successful! Redirecting..." });
        setTimeout(() => router.push("/"), 800);
      } else {
        if (res.code === "EMAIL_UNVERIFIED") {
          setNotification({ type: "info", message: res.error || "Email unverified. Verification OTP code sent." });
          setMode("signup_otp");
          setResendTimer(60);
          setCanResend(false);
        } else {
          setNotification({ type: "error", message: getErrorMessage(res, "Sign in failed. Invalid credentials.") });
        }
      }
    }

    if (mode === "signup") {
      const trimmedFirstName = firstName.trim();
      const trimmedLastName = lastName.trim();
      const trimmedEmail = email.trim();

      if (!trimmedFirstName) {
        setNotification({ type: "error", message: "First name is required." });
        return;
      }
      if (trimmedFirstName.length > 50) {
        setNotification({ type: "error", message: "First name cannot exceed 50 characters." });
        return;
      }

      if (!trimmedLastName) {
        setNotification({ type: "error", message: "Last name is required." });
        return;
      }
      if (trimmedLastName.length > 50) {
        setNotification({ type: "error", message: "Last name cannot exceed 50 characters." });
        return;
      }

      if (!trimmedEmail) {
        setNotification({ type: "error", message: "Email address is required." });
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setNotification({ type: "error", message: "Please enter a valid email address." });
        return;
      }

      if (!password) {
        setNotification({ type: "error", message: "Password is required." });
        return;
      }
      if (password.length < 8) {
        setNotification({ type: "error", message: "Password must be at least 8 characters long." });
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setNotification({ type: "error", message: "Password must contain at least one uppercase letter." });
        return;
      }
      if (!/[a-z]/.test(password)) {
        setNotification({ type: "error", message: "Password must contain at least one lowercase letter." });
        return;
      }
      if (!/[0-9]/.test(password)) {
        setNotification({ type: "error", message: "Password must contain at least one number." });
        return;
      }

      if (!agreeTerms) {
        setNotification({ type: "error", message: "Please accept the Terms of Service & Privacy Policy." });
        return;
      }

      setLoading(true);
      const res = await authApi.register({
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        email: trimmedEmail,
        password,
      });
      setLoading(false);

      if (res.success) {
        setMode("signup_otp");
        setResendTimer(60);
        setCanResend(false);
        setNotification({
          type: "info",
          message: res.message || `Verification OTP sent! Check your inbox at ${trimmedEmail}.`,
        });
      } else {
        setNotification({ type: "error", message: getErrorMessage(res, "Registration failed.") });
      }
    }

    if (mode === "signup_otp") {
      const fullOtp = otp.join("");
      if (fullOtp.length < 6) {
        setNotification({ type: "error", message: "Please enter the complete 6-digit OTP code." });
        return;
      }
      setLoading(true);
      const res = await authApi.verifyEmail({ email, otp: fullOtp });
      setLoading(false);

      if (res.success) {
        setNotification({ type: "success", message: res.message || "Email verified successfully! Welcome to Nexora AI." });
        setTimeout(() => router.push("/"), 1000);
      } else {
        setNotification({ type: "error", message: getErrorMessage(res, "Invalid or expired OTP code.") });
      }
    }

    if (mode === "forgot_email") {
      if (!email) {
        setNotification({ type: "error", message: "Please enter your registered email address." });
        return;
      }
      setLoading(true);
      const res = await authApi.forgotPassword(email);
      setLoading(false);

      if (res.success) {
        setMode("forgot_otp");
        setResendTimer(60);
        setCanResend(false);
        setNotification({
          type: "info",
          message: res.message || `Password reset OTP code sent to ${email}.`,
        });
      } else {
        setNotification({ type: "error", message: getErrorMessage(res, "Failed to request password reset.") });
      }
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
      const res = await authApi.resetPassword({ email, otp: fullOtp, newPassword: password });
      setLoading(false);

      if (res.success) {
        setNotification({ type: "success", message: res.message || "Password reset successful! Please sign in with your new password." });
        setTimeout(() => {
          setMode("login");
          setPassword("");
          setConfirmPassword("");
          setOtp(["", "", "", "", "", ""]);
        }, 1200);
      } else {
        setNotification({ type: "error", message: getErrorMessage(res, "Failed to reset password.") });
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-6 px-4 sm:px-6 lg:px-8 selection:bg-sky-500 selection:text-white transition-colors duration-300">
      {/* Top Header Bar with Theme Toggle */}
      <AuthHeader />

      {/* Geometric Dot & Mesh Background Grid Overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-40 dark:opacity-60 pointer-events-none transition-opacity" />
      <div className="absolute inset-0 bg-grid-mesh opacity-40 dark:opacity-40 pointer-events-none transition-opacity" />

      {/* Dynamic Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-tr from-sky-400/20 to-indigo-500/20 dark:from-sky-500/30 dark:to-indigo-600/30 blur-[140px] rounded-full pointer-events-none transition-all" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 dark:from-indigo-500/30 dark:to-purple-600/30 blur-[140px] rounded-full pointer-events-none transition-all" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-sky-400/10 via-indigo-400/10 to-cyan-300/10 dark:from-sky-500/15 dark:via-indigo-500/15 dark:to-cyan-400/15 blur-[180px] rounded-full pointer-events-none transition-all" />

      {/* Centered Main Glassmorphic Auth Container Card */}
      <div className="w-full max-w-lg mx-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-sky-500/10 z-10 my-auto py-8 transition-all duration-300">
        
        {/* Header Branding */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex justify-center">
            <NexoraLogo size="lg" variant="auto" />
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {mode === "login" && "Job Seeker & Candidate Portal"}
              {mode === "signup" && "Create Your Nexora Account"}
              {mode === "signup_otp" && "Verify Email Address"}
              {mode === "forgot_email" && "Reset Password"}
              {mode === "forgot_otp" && "Set New Password"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
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
          <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 mb-8 transition-colors">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setNotification(null);
              }}
              className={`py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 ${
                mode === "login"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
                ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300"
                : notification.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
                : "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-300"
            }`}
          >
            {notification.type === "error" ? (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 dark:text-rose-400 mt-0.5" />
            ) : notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 dark:text-emerald-400 mt-0.5" />
            ) : (
              <Sparkles className="w-5 h-5 shrink-0 text-sky-500 dark:text-sky-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{notification.message}</span>
          </div>
        )}

        {/* OAuth Buttons (Google, LinkedIn, GitHub - for Login & Sign Up) */}
        {(mode === "login" || mode === "signup") && (
          <OAuthButtons
            mode={mode}
            loading={loading}
            onOAuthLogin={handleOAuthLogin}
          />
        )}

        {/* Active Auth View Form Component */}
        {mode === "login" && (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            loading={loading}
            onSubmit={handleSubmit}
            onForgotPasswordClick={() => {
              setMode("forgot_email");
              setNotification(null);
            }}
          />
        )}

        {mode === "signup" && (
          <SignupForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}

        {(mode === "signup_otp" || (mode === "forgot_otp" && !password)) && (
          <OtpVerificationForm
            otp={otp}
            otpInputsRef={otpInputsRef}
            handleOtpChange={handleOtpChange}
            handleOtpKeyDown={handleOtpKeyDown}
            canResend={canResend}
            resendTimer={resendTimer}
            handleResendOtp={handleResendOtp}
            loading={loading}
            mode={mode === "signup_otp" ? "signup_otp" : "forgot_otp"}
            onSubmit={handleSubmit}
            onBackToLogin={() => {
              setMode("login");
              setNotification(null);
            }}
          />
        )}

        {(mode === "forgot_email" || (mode === "forgot_otp" && password !== undefined)) && (
          <ForgotPasswordForm
            mode={mode}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
            onSubmit={handleSubmit}
            onBackToLogin={() => {
              setMode("login");
              setNotification(null);
            }}
          />
        )}

        {/* Footer Sub-Links */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800/80 text-center space-y-2 transition-colors">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Looking for company recruitment or enterprise coach access?{" "}
            <Link href="/contact" className="text-sky-600 dark:text-sky-400 hover:underline font-medium">
              Contact Enterprise Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
