"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitHubRepository } from "@/lib/api/github";
import { Star, GitFork, Cpu, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Clock } from "lucide-react";

interface RepositoryCardProps {
  repository: GitHubRepository;
  onAnalyze: (repo: GitHubRepository) => void;
  onViewAnalysis: (repo: GitHubRepository) => void;
  analyzing: boolean;
}

export function RepositoryCard({
  repository,
  onAnalyze,
  onViewAnalysis,
  analyzing,
}: RepositoryCardProps) {
  const isAnalyzed = repository.analyses.length > 0 && repository.analyses[0].status === "COMPLETED";

  // Evidence level calculation: Strong if stars > 5 or fork count > 2 or analyzed
  const evidenceLevel = isAnalyzed
    ? "STRONG"
    : repository.stars >= 5 || repository.forks >= 2
    ? "MODERATE"
    : "LIMITED";

  const updatedDateStr = repository.pushedAt || repository.updatedAt;
  const formattedDate = updatedDateStr
    ? new Date(updatedDateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3">
        {/* Header: Title & Evidence Level */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <a
              href={repository.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors inline-flex items-center gap-1.5"
            >
              <span>{repository.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            <p className="text-xs font-mono text-slate-400">
              {repository.fullName}
            </p>
          </div>

          {/* Evidence Level Badge */}
          <span
            className={`px-2.5 py-1 rounded-full border text-[10px] font-extrabold flex items-center gap-1 shrink-0 ${
              isAnalyzed
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : evidenceLevel === "MODERATE"
                ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            {isAnalyzed ? "Strong Evidence" : `${evidenceLevel} Evidence`}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {repository.description || "No description provided for this repository."}
        </p>
      </div>

      {/* Footer & Actions */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3">
          {repository.primaryLanguage && (
            <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
              {repository.primaryLanguage}
            </span>
          )}
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{repository.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-3.5 h-3.5 text-slate-400" />
            <span>{repository.forks}</span>
          </div>
        </div>

        {/* Action Button */}
        {isAnalyzed ? (
          <button
            type="button"
            onClick={() => onViewAnalysis(repository)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <span>View Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAnalyze(repository)}
            disabled={analyzing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-sky-600 dark:hover:bg-sky-500 text-white dark:text-slate-900 font-bold text-xs transition-all shadow-sm disabled:opacity-50"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{analyzing ? "Analyzing..." : "Analyze Repository"}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
