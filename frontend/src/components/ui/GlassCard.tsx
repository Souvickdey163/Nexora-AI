"use client";

import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  onClick?: () => void;
}

export function GlassCard({
  children,
  className = "",
  glowOnHover = true,
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 transition-all duration-300 ${
        glowOnHover
          ? "hover:border-sky-500/50 dark:hover:border-sky-500/50 hover:shadow-sky-500/10 dark:hover:shadow-sky-500/10"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
