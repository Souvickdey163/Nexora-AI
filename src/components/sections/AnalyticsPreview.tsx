"use client";

import React from "react";
import Image from "next/image";
import { BarChart3, ShieldCheck, Sparkles, TrendingUp, CheckCircle, Award } from "lucide-react";

export function AnalyticsPreview() {
  const metrics = [
    { label: "Overall Career Readiness", value: "78%", color: "text-sky-500", bar: "w-[78%]" },
    { label: "Resume ATS Score", value: "84/100", color: "text-emerald-500", bar: "w-[84%]" },
    { label: "Coding Arena Rating", value: "72/100", color: "text-indigo-500", bar: "w-[72%]" },
    { label: "Mock Interview Telemetry", value: "76/100", color: "text-purple-500", bar: "w-[76%]" },
    { label: "GitHub Portfolio Audit", value: "81/100", color: "text-cyan-500", bar: "w-[81%]" },
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-50/50 dark:bg-slate-950/50 border-t border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Interactive Platform Analytics</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Data-Driven Clarity for Your Placement Journey.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Real-time telemetry across all core career domains so you always know where to focus your effort next.
          </p>
        </div>

        {/* Dashboard Analytics Preview Frame */}
        <div className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-0">
          {/* Header Bar */}
          <div className="px-6 py-4 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 ml-2">
                nexora.ai/dashboard/analytics
              </span>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-bold tracking-wide uppercase border border-sky-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Demo Preview Data</span>
            </div>
          </div>

          {/* Interactive Metric Cards */}
          <div className="p-6 md:p-10 space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-2"
                >
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block line-clamp-1">
                    {m.label}
                  </span>
                  <span className={`text-2xl font-extrabold ${m.color}`}>
                    {m.value}
                  </span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className={`bg-current ${m.color} h-full ${m.bar}`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Screenshot Visual Showcase */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-inner">
              <Image
                src="/images/placement-analytics-3d.png"
                alt="Data-Driven Clarity for Your Placement Journey - Nexora AI 3D Analytics"
                fill
                priority
                unoptimized
                sizes="(max-width: 1200px) 100vw, 1000px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                <div className="flex items-center gap-3 text-white text-xs font-medium bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800">
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                  <span>Interactive Career Velocity Tracking Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
