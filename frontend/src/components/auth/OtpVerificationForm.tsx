"use client";

import React, { MutableRefObject } from "react";
import { RefreshCw, ArrowRight, ArrowLeft } from "lucide-react";

interface OtpVerificationFormProps {
  otp: string[];
  otpInputsRef: MutableRefObject<(HTMLInputElement | null)[]>;
  handleOtpChange: (index: number, value: string) => void;
  handleOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  canResend: boolean;
  resendTimer: number;
  handleResendOtp: () => void;
  loading: boolean;
  mode: "signup_otp" | "forgot_otp";
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export function OtpVerificationForm({
  otp,
  otpInputsRef,
  handleOtpChange,
  handleOtpKeyDown,
  canResend,
  resendTimer,
  handleResendOtp,
  loading,
  mode,
  onSubmit,
  onBackToLogin,
}: OtpVerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-4 py-2">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
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
              className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
            />
          ))}
        </div>

        {/* Resend Timer & Button */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
          <span>Didn&apos;t receive code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="inline-flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:underline transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend OTP Code</span>
            </button>
          ) : (
            <span className="font-semibold text-slate-500">
              Resend in <strong className="text-sky-600 dark:text-sky-400">{resendTimer}s</strong>
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
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
                {mode === "signup_otp"
                  ? "Verify Email & Complete Sign Up"
                  : "Verify OTP & Continue"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Back to Login */}
      <div className="text-center pt-3">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </button>
      </div>
    </form>
  );
}
