"use client";

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "sky" | "emerald" | "amber" | "rose" | "purple" | "slate";
  size?: "sm" | "md";
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function Badge({
  children,
  variant = "sky",
  size = "md",
  icon: Icon,
  className = "",
}: BadgeProps) {
  const variantStyles = {
    sky: "bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/20",
    emerald: "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20",
    slate: "bg-slate-500/10 dark:bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/20",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
