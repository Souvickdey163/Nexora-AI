"use client";

import React from "react";
import { GlassCard } from "./GlassCard";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function StatCard({
  title,
  value,
  change,
  trend = "up",
  description,
  icon: Icon,
  badge,
}: StatCardProps) {
  return (
    <GlassCard className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500 dark:bg-sky-400/10 dark:text-sky-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </div>
        {change && (
          <div
            className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
              trend === "up"
                ? "text-emerald-500 dark:text-emerald-400"
                : trend === "down"
                ? "text-rose-500 dark:text-rose-400"
                : "text-slate-500"
            }`}
          >
            {trend === "up" ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : trend === "down" ? (
              <TrendingDown className="w-3.5 h-3.5" />
            ) : (
              <Minus className="w-3.5 h-3.5" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}

      {badge && (
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
          {badge}
        </span>
      )}
    </GlassCard>
  );
}
