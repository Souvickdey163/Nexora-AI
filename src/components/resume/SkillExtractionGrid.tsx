"use client";

import React, { useState } from "react";
import {
  Code2,
  Layers,
  Database,
  Wrench,
  Users,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

export interface SkillCategory {
  category: "Programming" | "Frameworks" | "Databases" | "Tools" | "Soft Skills";
  skills: string[];
}

export interface MissingSkill {
  name: string;
  importance: "High" | "Medium" | "Essential";
  reason: string;
  suggestedAction: string;
}

interface SkillExtractionGridProps {
  detectedSkills: SkillCategory[];
  missingSkills: MissingSkill[];
  targetRole: string;
}

export function SkillExtractionGrid({
  detectedSkills,
  missingSkills,
  targetRole,
}: SkillExtractionGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Programming":
        return <Code2 className="w-4 h-4 text-sky-500" />;
      case "Frameworks":
        return <Layers className="w-4 h-4 text-indigo-500" />;
      case "Databases":
        return <Database className="w-4 h-4 text-cyan-500" />;
      case "Tools":
        return <Wrench className="w-4 h-4 text-emerald-500" />;
      default:
        return <Users className="w-4 h-4 text-purple-500" />;
    }
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case "Essential":
      case "High":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
      default:
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. DETECTED SKILLS SECTION */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Extracted Resume Skills</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Automatically identified technical & behavioral competencies extracted from your document
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeCategory === "All"
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            {detectedSkills.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`px-3 py-1 rounded-lg transition-all hidden md:block ${
                  activeCategory === cat.category
                    ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Category Chips */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {detectedSkills
            .filter((c) => activeCategory === "All" || activeCategory === c.category)
            .map((cat) => (
              <div
                key={cat.category}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 space-y-3"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {getCategoryIcon(cat.category)}
                  <span>{cat.category}</span>
                  <span className="ml-auto text-[10px] font-semibold text-slate-400">
                    ({cat.skills.length})
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-sm flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* 2. MISSING SKILLS & KEYWORD GAP ANALYSIS */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Missing High-Impact Skills
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top keywords missing when benchmarked against recent <strong>{targetRole}</strong> job descriptions
            </p>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold">
            {missingSkills.length} Critical Gaps Found
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
          {missingSkills.map((item) => (
            <div
              key={item.name}
              className="p-5 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-amber-500" />
                  {item.name}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${getImportanceBadge(item.importance)}`}>
                  {item.importance} Importance
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Why it matters:</strong> {item.reason}
              </p>

              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between text-xs font-semibold text-sky-600 dark:text-sky-400">
                <span>Action: {item.suggestedAction}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
