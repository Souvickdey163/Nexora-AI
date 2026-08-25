"use client";

import React from "react";

interface ProgressRingProps {
  progress: number; // 0 - 100
  size?: number; // Circle size in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: "sky" | "emerald" | "amber" | "rose" | "indigo";
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color = "sky",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const strokeColors = {
    sky: "stroke-sky-500",
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    rose: "stroke-rose-500",
    indigo: "stroke-indigo-500",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-800 fill-none"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${strokeColors[color]} fill-none transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {label !== undefined ? label : `${Math.round(progress)}%`}
        </span>
        {sublabel && (
          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
