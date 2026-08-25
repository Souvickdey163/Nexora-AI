"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";
import {
  BarChart3,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";

export function CareerAnalyticsWorkspace() {
  return (
    <div className="space-y-8">
      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Readiness" value="88%" change="+5%" trend="up" />
        <StatCard title="Coding" value="92%" change="+8%" trend="up" />
        <StatCard title="Interview" value="86%" change="+4%" trend="up" />
        <StatCard title="Resume" value="88%" change="+2%" trend="up" />
        <StatCard title="Skills" value="90%" change="+6%" trend="up" />
        <StatCard title="Placement" value="84%" change="+7%" trend="up" />
      </div>

      {/* Main Analytics Charts & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Career Growth Curve & Activity */}
        <div className="lg:col-span-8 space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Career Readiness Growth Over Time
                </h3>
                <p className="text-xs text-slate-500">Weekly progress velocity across coding, interviews, and resume quality.</p>
              </div>
              <Badge variant="emerald" icon={TrendingUp}>
                On Track
              </Badge>
            </div>

            {/* Visual Bar Graph */}
            <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-200 dark:border-slate-800">
              {[
                { week: "W1", score: 52 },
                { week: "W2", score: 60 },
                { week: "W3", score: 68 },
                { week: "W4", score: 74 },
                { week: "W5", score: 80 },
                { week: "W6", score: 84 },
                { week: "W7", score: 88 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.score}%
                  </span>
                  <div
                    style={{ height: `${item.score}%` }}
                    className="w-full max-w-[40px] bg-gradient-to-t from-sky-500 to-indigo-600 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                  />
                  <span className="text-[11px] font-bold text-slate-500">{item.week}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Unified Score Index & Recommendations */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard className="text-center space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Overall Career Score Index
            </h4>
            <div className="flex justify-center py-2">
              <ProgressRing progress={88} size={150} label="88%" sublabel="Readiness" color="sky" />
            </div>

            <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
              <span className="font-bold text-sky-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Recommended Next Step:
              </span>
              <p>Complete 2 System Design mock interview sessions to push readiness score above 90%.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
