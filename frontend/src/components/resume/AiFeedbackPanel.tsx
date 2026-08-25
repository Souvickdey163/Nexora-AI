"use client";

import React from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, Lightbulb, FileSpreadsheet } from "lucide-react";

export interface FeedbackItem {
  id: string;
  category: "ATS Parser" | "Writing Style" | "Formatting" | "Technical Depth";
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  actionableTip: string;
}

interface AiFeedbackPanelProps {
  feedbackItems: FeedbackItem[];
}

export function AiFeedbackPanel({ feedbackItems }: AiFeedbackPanelProps) {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
      default:
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-indigo-500" />
            <span>AI Resume Intelligence Audit</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Prioritized recommendations categorized by severity and ATS screening impact
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
        {feedbackItems.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {item.category}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getSeverityBadge(item.severity)}`}>
                {item.severity} Priority
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {item.title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.description}
            </p>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-start gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>Tip: {item.actionableTip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
