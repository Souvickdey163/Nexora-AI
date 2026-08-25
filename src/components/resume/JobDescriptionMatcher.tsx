"use client";

import React, { useState } from "react";
import {
  Briefcase,
  FileCheck,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Loader2,
} from "lucide-react";

export function JobDescriptionMatcher() {
  const [jdText, setJdText] = useState("");
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    percentage: number;
    matchingSkills: string[];
    missingKeywords: string[];
    recommendations: string[];
  } | null>({
    percentage: 87,
    matchingSkills: ["React.js", "TypeScript", "Next.js", "REST APIs", "Git", "TailwindCSS"],
    missingKeywords: ["GraphQL", "Jest / RTL", "CI/CD Pipelines", "Docker"],
    recommendations: [
      "Add GraphQL query optimization metrics to Work Experience.",
      "Explicitly mention Jest and React Testing Library unit test coverage.",
      "Highlight Docker container deployment experience in Projects.",
    ],
  });

  const handleRunMatch = () => {
    if (!jdText.trim()) return;
    setIsMatching(true);
    setTimeout(() => {
      setMatchResult({
        percentage: 91,
        matchingSkills: [
          "React.js",
          "TypeScript",
          "Next.js",
          "REST APIs",
          "Git",
          "TailwindCSS",
          "Node.js",
        ],
        missingKeywords: ["GraphQL", "Docker"],
        recommendations: [
          "Include Docker containerization in the skills summary.",
          "Add mention of GraphQL query layer optimization.",
        ],
      });
      setIsMatching(false);
    }, 800);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-sky-500" />
            <span>Target Job Description Matcher</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Paste a target job posting description to benchmark keyword alignment and match score
          </p>
        </div>

        {matchResult && (
          <div className="px-4 py-2 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-extrabold text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>{matchResult.percentage}% Role Match</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Left Column Text Area */}
        <div className="lg:col-span-5 space-y-4">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Paste Target Job Description
          </label>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job posting duties, qualifications, and tech requirements here..."
            className="w-full h-44 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none font-mono"
          />
          
          <button
            onClick={handleRunMatch}
            disabled={isMatching}
            className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
          >
            {isMatching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Matching Keywords...</span>
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                <span>Match With Job Description</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column Analysis Output */}
        {matchResult && (
          <div className="lg:col-span-7 space-y-5">
            {/* Match Percentage Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-cyan-500/10 border border-sky-500/20 flex items-center justify-between">
              <div>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {matchResult.percentage}% Match Rating
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  High alignment with target technical stack and responsibility keywords.
                </p>
              </div>

              <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
                {matchResult.percentage}%
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Matching Skills */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Matched Skills ({matchResult.matchingSkills.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.matchingSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold"
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-4 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 space-y-2">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                  <XCircle className="w-4 h-4" /> Missing Keywords ({matchResult.missingKeywords.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {matchResult.missingKeywords.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300 text-[11px] font-semibold"
                    >
                      + {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-sky-500" /> Recommended Job-Match Changes
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {matchResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
