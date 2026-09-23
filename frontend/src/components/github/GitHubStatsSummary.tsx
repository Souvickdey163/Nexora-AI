"use client";

import React from "react";
import { motion } from "framer-motion";
import { FolderGit2, Code2, Cpu, ShieldCheck } from "lucide-react";

interface GitHubStatsSummaryProps {
  totalRepos: number;
  totalLanguages: number;
  analyzedCount: number;
}

export function GitHubStatsSummary({
  totalRepos,
  totalLanguages,
  analyzedCount,
}: GitHubStatsSummaryProps) {
  const cards = [
    {
      title: "Repositories Discovered",
      value: totalRepos,
      subtitle: "Public code repositories synced",
      icon: FolderGit2,
      color: "text-sky-500",
    },
    {
      title: "Technical Languages",
      value: totalLanguages,
      subtitle: "Detected from codebase byte maps",
      icon: Code2,
      color: "text-indigo-500",
    },
    {
      title: "Projects Analyzed",
      value: analyzedCount,
      subtitle: "Detailed signal & AI reviews complete",
      icon: Cpu,
      color: "text-emerald-500",
    },
    {
      title: "Engineering Evidence",
      value: analyzedCount > 0 ? "Active" : "Detected",
      subtitle: "Real GitHub signals extracted",
      icon: ShieldCheck,
      color: "text-amber-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-xs font-semibold">{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {card.subtitle}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}
