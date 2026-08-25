"use client";

import React from "react";
import { ArrowRight, CheckCircle2, TrendingUp, Sparkles, FileDiff } from "lucide-react";

export function ResumeComparisonView() {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileDiff className="w-5 h-5 text-sky-500" />
            <span>Original vs. AI-Improved Comparison</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Quantified impact metrics comparing original baseline against AI-optimized version
          </p>
        </div>

        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          +16 Points Score Gain
        </span>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">ATS Score</span>
          <div className="flex items-center justify-center gap-2 text-xl font-extrabold">
            <span className="text-slate-400 line-through">72</span>
            <ArrowRight className="w-4 h-4 text-sky-500" />
            <span className="text-emerald-500">88</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold block">+22% Improvement</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Keyword Match</span>
          <div className="flex items-center justify-center gap-2 text-xl font-extrabold">
            <span className="text-slate-400 line-through">64%</span>
            <ArrowRight className="w-4 h-4 text-sky-500" />
            <span className="text-emerald-500">92%</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold block">+28% Keywords Added</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Action Verbs</span>
          <div className="flex items-center justify-center gap-2 text-xl font-extrabold">
            <span className="text-slate-400 line-through">5</span>
            <ArrowRight className="w-4 h-4 text-sky-500" />
            <span className="text-emerald-500">18</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold block">3.6x Stronger Verbs</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Quantified Results</span>
          <div className="flex items-center justify-center gap-2 text-xl font-extrabold">
            <span className="text-slate-400 line-through">2</span>
            <ArrowRight className="w-4 h-4 text-sky-500" />
            <span className="text-emerald-500">9</span>
          </div>
          <span className="text-[10px] text-emerald-500 font-bold block">+7 Metric Statements</span>
        </div>

      </div>
    </div>
  );
}
