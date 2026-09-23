"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/navbar/ThemeToggle";

export function AuthHeader() {
  return (
    <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-2 z-20">
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold backdrop-blur-md transition-all duration-200 shadow-sm group"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-sky-500 dark:text-sky-400" />
        <span>Back to Home</span>
      </Link>

      {/* Right Action Bar: Theme Toggle & Security Status */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400 backdrop-blur-md shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
          <span>Nexora AI Security</span>
        </div>

        <div className="bg-white/90 dark:bg-slate-900/90 p-1 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
