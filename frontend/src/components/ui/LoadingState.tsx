"use client";

import React from "react";

interface LoadingStateProps {
  label?: string;
  description?: string;
}

export function LoadingState({
  label = "Loading workspace data...",
  description = "Synthesizing AI insights and metrics...",
}: LoadingStateProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center space-y-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-sky-500/20 border-t-sky-500 animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-sky-500/20 animate-ping" />
      </div>
      <div className="space-y-1">
        <h4 className="text-base font-bold text-slate-900 dark:text-white">
          {label}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}
