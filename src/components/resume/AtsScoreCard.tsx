"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Shield, Award, Sparkles, TrendingUp, HelpCircle } from "lucide-react";

export interface AtsScoreData {
  score: number;
  status: "Needs Improvement" | "Good" | "Excellent";
  summary: string;
  metrics: {
    overall: number;
    readability: number;
    structure: number;
    keywords: number;
    impact: number;
  };
  passedChecksCount: number;
  totalChecksCount: number;
}

interface AtsScoreCardProps {
  data: AtsScoreData;
}

export function AtsScoreCard({ data }: AtsScoreCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return {
          badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
          ring: "stroke-emerald-500",
          text: "text-emerald-600 dark:text-emerald-400",
        };
      case "Good":
        return {
          badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
          ring: "stroke-sky-500",
          text: "text-sky-600 dark:text-sky-400",
        };
      default:
        return {
          badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
          ring: "stroke-amber-500",
          text: "text-amber-600 dark:text-amber-400",
        };
    }
  };

  const colors = getStatusColor(data.status);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-500" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              ATS Compatibility Score
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Evaluated against top applicant tracking system parsers (Greenhouse, Lever, Workday)
          </p>
        </div>

        <span className={`px-3.5 py-1.5 rounded-full border text-xs font-bold ${colors.badge}`}>
          {data.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        
        {/* Large 3D Circular Radial Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80">
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                className={`${colors.ring} transition-all duration-1000 ease-out`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {data.score}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                out of 100
              </span>
            </div>
          </div>

          {/* Status caption */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              {data.summary}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Passed {data.passedChecksCount} of {data.totalChecksCount} ATS Rules</span>
            </div>
          </div>
        </div>

        {/* Quality Metrics Breakdown */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Resume Quality Dimensions
          </h4>

          {/* Metric Item: Readability */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Readability & Font Structure</span>
              <span className="text-slate-900 dark:text-white font-bold">{data.metrics.readability}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full"
                style={{ width: `${data.metrics.readability}%` }}
              />
            </div>
          </div>

          {/* Metric Item: Structural Formatting */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">ATS Parsing Structure</span>
              <span className="text-slate-900 dark:text-white font-bold">{data.metrics.structure}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${data.metrics.structure}%` }}
              />
            </div>
          </div>

          {/* Metric Item: Keywords */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Target Role Keyword Density</span>
              <span className="text-slate-900 dark:text-white font-bold">{data.metrics.keywords}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${data.metrics.keywords}%` }}
              />
            </div>
          </div>

          {/* Metric Item: Impact */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Measurable Impact & Action Verbs</span>
              <span className="text-slate-900 dark:text-white font-bold">{data.metrics.impact}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${data.metrics.impact}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 mt-4">
            <TrendingUp className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
            <span>
              <strong>Recruiter Insight:</strong> Resumes scoring above 80+ are 3.2x more likely to clear automated screeners and advance to phone screen interviews.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
