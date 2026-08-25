"use client";

import React from "react";
import { History, Calendar, FileText, ArrowUpRight, Eye } from "lucide-react";

export interface VersionItem {
  id: string;
  filename: string;
  date: string;
  atsScore: number;
  quality: "Good" | "Excellent" | "Needs Improvement";
  targetRole: string;
}

const DEMO_HISTORY: VersionItem[] = [
  {
    id: "v-3",
    filename: "Alex_Morgan_Resume_v3.pdf",
    date: "Aug 24, 2026",
    atsScore: 88,
    quality: "Excellent",
    targetRole: "Full-Stack Engineer",
  },
  {
    id: "v-2",
    filename: "Alex_Morgan_Resume_v2.pdf",
    date: "Aug 18, 2026",
    atsScore: 82,
    quality: "Good",
    targetRole: "Full-Stack Engineer",
  },
  {
    id: "v-1",
    filename: "Alex_Morgan_Resume_v1.pdf",
    date: "Aug 10, 2026",
    atsScore: 72,
    quality: "Needs Improvement",
    targetRole: "Frontend Software Engineer",
  },
];

interface ResumeVersionHistoryProps {
  onSelectVersion: (version: VersionItem) => void;
}

export function ResumeVersionHistory({ onSelectVersion }: ResumeVersionHistoryProps) {
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <History className="w-5 h-5 text-sky-500" />
            <span>Resume Version History</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track past uploads, benchmark role ATS scores, and compare iteration progress
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {DEMO_HISTORY.map((item) => (
          <div
            key={item.id}
            className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-950/40 px-3 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{item.filename}</span>
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" /> {item.date}
                  </span>
                  <span>Target: {item.targetRole}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">ATS Score:</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-xs font-extrabold ${
                  item.atsScore >= 85
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30"
                }`}>
                  {item.atsScore} / 100
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectVersion(item)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Analysis</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
