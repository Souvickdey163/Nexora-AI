"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { RepositoryAnalysis, GitHubRepository } from "@/lib/api/github";
import {
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Cpu,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Code2,
} from "lucide-react";

interface RepositoryDetailModalProps {
  repository: GitHubRepository;
  analysis: RepositoryAnalysis;
  onClose: () => void;
}

export function RepositoryDetailModal({
  repository,
  analysis,
  onClose,
}: RepositoryDetailModalProps) {
  const [copiedBullet, setCopiedBullet] = useState<number | null>(null);

  const handleCopyBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(index);
    setTimeout(() => setCopiedBullet(null), 2000);
  };

  const signals = analysis.engineeringSignals;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-8 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {repository.name}
                </h2>
                <a
                  href={repository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub
                </a>
              </div>
              <p className="text-xs font-mono text-slate-400">
                {repository.fullName}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Overview & Architecture */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" />
                Project Understanding
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysis.projectSummary}
              </p>
            </div>

            <div className="space-y-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-500" />
                Architecture Signals
              </h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysis.architectureSummary}
              </p>
            </div>
          </div>

          {/* Tech Stack Badges */}
          {analysis.detectedStack.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5" />
                Detected Stack & Tech Evidence
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.detectedStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Engineering Practice Signals Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Engineering Practice Signals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span>README</span>
                {signals?.hasReadme ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span>Unit Tests</span>
                {signals?.hasTests ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span>CI/CD Workflows</span>
                {signals?.hasCiCd ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                )}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <span>Docker Setup</span>
                {signals?.hasDocker ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>
          </div>

          {/* AI Code Review (Clearly Labeled Requirement #10) */}
          <div className="p-5 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                AI-Generated Engineering Observations
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">
                Advisory Review
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Maintainability & Modularity</span>
                <p className="text-slate-600 dark:text-slate-400">{analysis.aiReview.maintainability}</p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Testing & Quality</span>
                <p className="text-slate-600 dark:text-slate-400">{analysis.aiReview.testingCoverage}</p>
              </div>
            </div>
          </div>

          {/* Resume Bullet Generator */}
          {analysis.resumeBullets.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Resume-Ready Bullets (GitHub → Resume)
              </h3>
              <div className="space-y-2">
                {analysis.resumeBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-xs leading-relaxed"
                  >
                    <p className="text-slate-700 dark:text-slate-300">{bullet}</p>
                    <button
                      type="button"
                      onClick={() => handleCopyBullet(bullet, idx)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 font-semibold transition-colors shrink-0"
                    >
                      {copiedBullet === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy bullet</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project-based Mock Interview Questions */}
          {analysis.interviewQuestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Project-Specific Mock Interview Questions
                </h3>
                <Link
                  href="/features/interview"
                  className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Practice in Interview Studio</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {analysis.interviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        Q{idx + 1}: {q.question}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold text-[10px]">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400">
                      <strong>Follow-up:</strong> {q.followUp}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cross-Feature Action Buttons */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-end gap-3">
            <Link
              href="/features/mentor"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-sky-500" />
              <span>Ask Nexus AI About This Project</span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity shadow-sm"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
