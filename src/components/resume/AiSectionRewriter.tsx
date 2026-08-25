"use client";

import React, { useState } from "react";
import {
  Wand2,
  Check,
  Copy,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { SectionDetail } from "./SectionAnalysisCards";

interface AiSectionRewriterProps {
  section: SectionDetail | null;
  onClose: () => void;
  onAccept: (sectionId: string, text: string) => void;
}

export function AiSectionRewriter({
  section,
  onClose,
  onAccept,
}: AiSectionRewriterProps) {
  if (!section) return null;

  const [currentText, setCurrentText] = useState(section.sampleOriginalText);
  const [improvedText, setImprovedText] = useState(section.sampleImprovedText);
  const [tone, setTone] = useState<"Technical" | "Concise" | "Executive">("Technical");
  const [isCopied, setIsCopied] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(improvedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleRegenerate = (selectedTone: "Technical" | "Concise" | "Executive") => {
    setTone(selectedTone);
    setIsRegenerating(true);
    setTimeout(() => {
      if (selectedTone === "Concise") {
        setImprovedText(
          "Engineered React/TypeScript frontend micro-apps, accelerating load velocity by 40% and increasing developer deployment frequency."
        );
      } else if (selectedTone === "Executive") {
        setImprovedText(
          "Spearheaded core frontend architecture modernizations across enterprise teams, resulting in 40% performance gains and $120K annual infrastructure optimization."
        );
      } else {
        setImprovedText(section.sampleImprovedText);
      }
      setIsRegenerating(false);
    }, 600);
  };

  const handleRevert = () => {
    setImprovedText(section.sampleOriginalText);
    setIsAccepted(false);
  };

  const handleAcceptClick = () => {
    setIsAccepted(true);
    onAccept(section.id, improvedText);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Section Rewriter: {section.name}</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enhance bullet points with action verbs, quantifiable metrics, and ATS keywords.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tone Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            AI Tone Strategy:
          </span>
          <div className="flex items-center gap-2">
            {(["Technical", "Concise", "Executive"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleRegenerate(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  tone === t
                    ? "bg-sky-500 text-white border-sky-500 shadow-sm"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400"
                }`}
              >
                {t} Mode
              </button>
            ))}
          </div>
        </div>

        {/* Before vs After Side-by-Side View */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* BEFORE Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Original Text (Before)</span>
              <span className="text-[10px] text-slate-400">Current Resume</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed min-h-[140px] whitespace-pre-wrap font-mono">
              {currentText}
            </div>
          </div>

          {/* AFTER Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Improved (After)
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold">+18% Impact Score</span>
            </div>
            <div className={`p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/30 text-xs text-slate-800 dark:text-slate-200 leading-relaxed min-h-[140px] whitespace-pre-wrap font-mono transition-all ${
              isRegenerating ? "opacity-40 animate-pulse" : "opacity-100"
            }`}>
              {improvedText}
            </div>
          </div>

        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>AI suggestions are recommendations. Review all text before finalizing.</span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={handleRevert}
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Revert</span>
            </button>

            <button
              onClick={handleCopy}
              type="button"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? "Copied!" : "Copy Text"}</span>
            </button>

            <button
              onClick={handleAcceptClick}
              type="button"
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                isAccepted
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-sky-500/20"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAccepted ? "Accepted ✓" : "Accept Suggestion"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
