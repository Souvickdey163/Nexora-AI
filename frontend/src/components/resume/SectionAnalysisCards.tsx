"use client";

import React, { useState } from "react";
import {
  FileText,
  User,
  GraduationCap,
  Briefcase,
  FolderGit2,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Wand2,
  ChevronDown,
  ChevronUp,
  Award,
} from "lucide-react";

export interface SectionDetail {
  id: string;
  name: string;
  score: number;
  iconName: "User" | "FileText" | "Briefcase" | "FolderGit2" | "GraduationCap" | "Award" | "Skills";
  strengths: string[];
  problems: string[];
  suggestions: string[];
  sampleOriginalText: string;
  sampleImprovedText: string;
}

interface SectionAnalysisCardsProps {
  sections: SectionDetail[];
  onOpenRewriter: (section: SectionDetail) => void;
}

export function SectionAnalysisCards({
  sections,
  onOpenRewriter,
}: SectionAnalysisCardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(sections[0]?.id || null);

  const getSectionIcon = (iconName: string) => {
    switch (iconName) {
      case "User":
        return <User className="w-5 h-5 text-sky-500" />;
      case "FileText":
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case "Briefcase":
        return <Briefcase className="w-5 h-5 text-emerald-500" />;
      case "FolderGit2":
        return <FolderGit2 className="w-5 h-5 text-cyan-500" />;
      case "GraduationCap":
        return <GraduationCap className="w-5 h-5 text-purple-500" />;
      default:
        return <Award className="w-5 h-5 text-amber-500" />;
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    if (score >= 75) return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30";
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <span>Section-by-Section ATS Audit</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Granular breakdown of each resume section with actionable AI rewrite suggestions
          </p>
        </div>
      </div>

      <div className="space-y-4 pt-6">
        {sections.map((section) => {
          const isExpanded = expandedId === section.id;
          return (
            <div
              key={section.id}
              className={`rounded-2xl border transition-all duration-300 ${
                isExpanded
                  ? "bg-slate-50/90 dark:bg-slate-950/70 border-sky-500/40 shadow-lg"
                  : "bg-white dark:bg-slate-950/30 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              {/* Card Header Header */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                className="p-5 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    {getSectionIcon(section.iconName)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{section.name}</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {section.strengths.length} Strengths • {section.problems.length} Areas to Improve
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full border text-xs font-bold ${getScoreBadge(section.score)}`}>
                    {section.score} / 100
                  </span>
                  <button
                    type="button"
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Card Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Section Strengths
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {section.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Problems Detected */}
                    <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Detected Issues
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {section.problems.map((prob, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-amber-500">•</span>
                            <span>{prob}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Suggestions & Improve Action */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                        AI Recommendation
                      </span>
                      <p className="text-xs text-slate-700 dark:text-slate-300">
                        {section.suggestions[0] || "Optimize section phrasing with action-oriented metrics."}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenRewriter(section)}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Improve {section.name} with AI</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
