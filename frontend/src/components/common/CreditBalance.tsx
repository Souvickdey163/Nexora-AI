"use client";

import React from "react";
import Link from "next/link";
import { Zap, PlusCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface CreditBalanceProps {
  compact?: boolean;
  showBuyButton?: boolean;
  className?: string;
}

export function CreditBalance({
  compact = false,
  showBuyButton = false,
  className = "",
}: CreditBalanceProps) {
  const { user } = useAuth();
  const credits = user?.credits ?? 0;

  const isLow = credits <= 2;
  const isZero = credits === 0;

  if (compact) {
    return (
      <Link
        href="/pricing"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold tracking-tight transition-all duration-200 border ${
          isZero
            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
            : isLow
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
            : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 hover:bg-sky-500/20"
        } ${className}`}
      >
        <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
        <span>⚡ {credits}</span>
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border shadow-sm ${
          isZero
            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
            : isLow
            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
        }`}
      >
        <Zap className="w-4 h-4 fill-current text-sky-500" />
        <span>⚡ {credits} {credits === 1 ? "Credit" : "Credits"}</span>
      </div>

      {showBuyButton && (
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity shadow-sm"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Buy Credits</span>
        </Link>
      )}
    </div>
  );
}
