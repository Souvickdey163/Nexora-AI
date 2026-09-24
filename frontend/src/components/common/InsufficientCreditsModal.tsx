"use client";

import React from "react";
import Link from "next/link";
import { Zap, AlertCircle, ArrowRight, X } from "lucide-react";

interface InsufficientCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredCredits?: number;
  currentCredits?: number;
}

export function InsufficientCreditsModal({
  isOpen,
  onClose,
  requiredCredits = 1,
  currentCredits = 0,
}: InsufficientCreditsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-6 space-y-6 overflow-hidden">
        {/* Decorative ambient gradient */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 fill-current animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              You&apos;ve run out of credits
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nexora AI Premium Operation
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Current Balance:</span>
            <span className="text-slate-900 dark:text-white font-bold">{currentCredits} Credits</span>
          </div>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500 dark:text-slate-400">Required Credits:</span>
            <span className="text-amber-600 dark:text-amber-400 font-bold">{requiredCredits} Credits</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Purchase more credits to continue using Nexora AI features like Resume Intelligence, Mock Interviews, AI Mentor, and Repository Analysis.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-sky-500/20"
          >
            <span>Buy Credits</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/pricing"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <span>View Pricing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
