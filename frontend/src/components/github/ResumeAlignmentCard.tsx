"use client";

import React from "react";
import { motion } from "framer-motion";
import { ResumeAlignmentItem } from "@/lib/api/github";
import { CheckCircle2, AlertTriangle, Sparkles, ArrowRight } from "lucide-react";

interface ResumeAlignmentCardProps {
  alignmentItems: ResumeAlignmentItem[];
}

export function ResumeAlignmentCard({ alignmentItems }: ResumeAlignmentCardProps) {
  if (!alignmentItems || alignmentItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Resume ↔ GitHub Alignment
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            See which skills from your resume are supported by actual GitHub repository evidence.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold shrink-0">
          {alignmentItems.filter((i) => i.githubEvidence === "STRONG" || i.githubEvidence === "MODERATE").length} / {alignmentItems.length} Skills Verified
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alignmentItems.map((item) => (
          <div
            key={item.skill}
            className={`p-4 rounded-2xl border transition-all space-y-2 ${
              item.githubEvidence === "STRONG"
                ? "bg-emerald-500/5 border-emerald-500/30 text-emerald-950 dark:text-emerald-200"
                : item.githubEvidence === "MODERATE"
                ? "bg-sky-500/5 border-sky-500/30 text-sky-950 dark:text-sky-200"
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                {item.skill}
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide border ${
                  item.githubEvidence === "STRONG"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                    : item.githubEvidence === "MODERATE"
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                    : "bg-slate-500/10 text-slate-500 border-slate-500/20"
                }`}
              >
                {item.githubEvidence === "STRONG"
                  ? "Strong Evidence"
                  : item.githubEvidence === "MODERATE"
                  ? "Moderate Evidence"
                  : item.githubEvidence === "LIMITED"
                  ? "Limited Evidence"
                  : "Insufficient Evidence"}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold">
              {item.githubEvidence === "STRONG" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : item.githubEvidence === "MODERATE" ? (
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              <span>{item.statusLabel}</span>
            </div>

            {item.matchingRepositories.length > 0 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Detected in: <strong className="text-slate-700 dark:text-slate-300">{item.matchingRepositories.join(", ")}</strong>
              </p>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
