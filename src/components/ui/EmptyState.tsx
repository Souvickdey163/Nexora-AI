"use client";

import React from "react";
import { GlowButton } from "./GlowButton";
import { Sparkles } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Sparkles,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center space-y-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
      <div className="p-4 rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-400/10 dark:text-sky-400">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1.5 max-w-md">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <GlowButton onClick={onAction} size="sm">
          {actionLabel}
        </GlowButton>
      )}
    </div>
  );
}
