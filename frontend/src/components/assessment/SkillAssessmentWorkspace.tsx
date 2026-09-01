"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BarChart3,
  RefreshCw,
  ArrowRight,
  BookOpen,
} from "lucide-react";

type AssessmentStep = "select" | "active" | "results";

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    category: "DBMS & SQL",
    question: "Which transaction isolation level prevents dirty reads, non-repeatable reads, and phantom reads in SQL databases?",
    options: [
      "Read Uncommitted",
      "Read Committed",
      "Repeatable Read",
      "Serializable",
    ],
    correctIndex: 3,
    explanation: "Serializable is the highest isolation level and guarantees complete isolation from concurrent transactions.",
  },
  {
    id: 2,
    category: "Operating Systems",
    question: "What is the primary cause of a 'Thrashing' state in virtual memory management?",
    options: [
      "Excessive CPU clock speed",
      "High rate of page faults causing constant disk swapping",
      "Deadlock among POSIX threads",
      "Unrestricted heap allocation in C++",
    ],
    correctIndex: 1,
    explanation: "Thrashing occurs when the operating system spends more time swapping pages in and out of memory than executing actual process instructions.",
  },
  {
    id: 3,
    category: "System Design",
    question: "In a CAP Theorem compliant distributed database, what must a system trade off during a network partition (P)?",
    options: [
      "Speed vs Storage",
      "Consistency (C) vs Availability (A)",
      "Read Throughput vs Write Throughput",
      "CPU Utilization vs Bandwidth",
    ],
    correctIndex: 1,
    explanation: "When a network partition occurs, a distributed system must choose between returning consistent data or remaining available for writes/reads.",
  },
];

export function SkillAssessmentWorkspace() {
  const [step, setStep] = useState<AssessmentStep>("select");
  const [selectedCategory, setSelectedCategory] = useState("DBMS & Core CS");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(300);

  const handleStartQuiz = () => {
    setStep("active");
    setCurrentIdx(0);
    setUserAnswers({});
    setTimeRemaining(300);
  };

  const handleSelectOption = (optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [currentIdx]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correct++;
    });
    return Math.round((correct / QUIZ_QUESTIONS.length) * 100);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {step === "select" && (
        <GlassCard className="space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Computer Science Diagnostic Skill Assessment
              </h3>
              <p className="text-xs text-slate-500">
                Test your knowledge in DSA, DBMS, OS, Computer Networks, and System Design.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Assessment Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option>DBMS & Core CS</option>
                <option>Data Structures & Algorithms</option>
                <option>Operating Systems & Concurrency</option>
                <option>Computer Networks & HTTP/TCP</option>
                <option>Distributed System Design</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white"
              >
                <option>Beginner (Fundamentals)</option>
                <option>Intermediate (Standard Tech Interview)</option>
                <option>Advanced (Staff / Senior)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <GlowButton onClick={handleStartQuiz} icon={ArrowRight} size="lg">
              Begin Timed Assessment
            </GlowButton>
          </div>
        </GlassCard>
      )}

      {step === "active" && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <Badge variant="amber">
              Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
            </Badge>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>04:45 Remaining</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {QUIZ_QUESTIONS[currentIdx].question}
            </h4>

            <div className="space-y-2.5">
              {QUIZ_QUESTIONS[currentIdx].options.map((opt, optionIdx) => {
                const isSelected = userAnswers[currentIdx] === optionIdx;
                return (
                  <button
                    key={optionIdx}
                    onClick={() => handleSelectOption(optionIdx)}
                    className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/40 shadow-sm"
                        : "bg-slate-100/80 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + optionIdx)}.</span> {opt}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <GlowButton
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              variant="outline"
              size="sm"
            >
              Previous
            </GlowButton>

            {currentIdx < QUIZ_QUESTIONS.length - 1 ? (
              <GlowButton onClick={() => setCurrentIdx((prev) => prev + 1)} size="sm">
                Next Question
              </GlowButton>
            ) : (
              <GlowButton onClick={() => setStep("results")} size="sm" icon={CheckCircle2}>
                Submit Assessment
              </GlowButton>
            )}
          </div>
        </GlassCard>
      )}

      {step === "results" && (
        <GlassCard className="text-center space-y-6 py-6">
          <Badge variant="emerald" icon={CheckCircle2}>
            Assessment Complete
          </Badge>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Skill Proficiency Report
          </h3>

          <div className="flex justify-center py-2">
            <ProgressRing progress={calculateScore()} size={140} label={`${calculateScore()}%`} color="emerald" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs text-left">
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
              <span className="font-bold text-emerald-500">Strong Domain:</span>
              <p className="text-slate-700 dark:text-slate-200">DBMS Transaction Isolation & ACID Properties</p>
            </div>
            <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
              <span className="font-bold text-sky-500">Recommended Path:</span>
              <p className="text-slate-700 dark:text-slate-200">Study CAP Theorem & Distributed Systems</p>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <GlowButton onClick={() => setStep("select")} icon={RefreshCw} variant="outline">
              Take Another Assessment
            </GlowButton>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
