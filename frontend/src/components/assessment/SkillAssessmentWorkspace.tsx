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
  RefreshCw,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { assessmentApi } from "@/lib/api/assessment";
import { useAuth } from "@/context/AuthContext";

type AssessmentStep = "select" | "active" | "results";

interface Question {
  id: string;
  questionText?: string;
  question?: string;
  options: string[];
  explanation?: string;
}

export function SkillAssessmentWorkspace() {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<AssessmentStep>("select");
  const [selectedCategory, setSelectedCategory] = useState("DBMS & SQL");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scoreResult, setScoreResult] = useState<{ score: number; passed: boolean; feedback?: string } | null>(null);

  const handleStartQuiz = async () => {
    setLoading(true);
    setError(null);
    const res = await assessmentApi.startAssessment({
      category: selectedCategory,
      difficulty,
    });

    if (res.success && res.questions && res.attemptId) {
      setAttemptId(res.attemptId);
      setQuestions(res.questions);
      setCurrentIdx(0);
      setUserAnswers({});
      setStep("active");
      await refreshUser();
    } else {
      setError(res.error || "Failed to start assessment.");
    }
    setLoading(false);
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitAssessment = async () => {
    if (!attemptId) return;
    setSubmitting(true);
    setError(null);
    const formattedAnswers = Object.entries(userAnswers).map(([questionId, selectedOptionIndex]) => ({
      questionId,
      selectedOptionIndex,
    }));

    const res = await assessmentApi.submitAssessment({
      attemptId,
      category: selectedCategory,
      difficulty,
      answers: formattedAnswers,
    });

    if (res.success && typeof res.score === 'number') {
      setScoreResult({
        score: res.score,
        passed: Boolean(res.passed),
        feedback: res.score >= 70 ? "Excellent domain understanding!" : "Focus on fundamental concepts and retry.",
      });
      setStep("results");
      await refreshUser();
    } else {
      setError(res.error || "Failed to submit assessment.");
    }
    setSubmitting(false);
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
                Test your knowledge in DSA, DBMS, OS, Computer Networks, and System Design. (Costs 2 ⚡)
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

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
                <option value="DBMS & SQL">DBMS & SQL</option>
                <option value="DSA">Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems & Concurrency</option>
                <option value="Computer Networks">Computer Networks & HTTP/TCP</option>
                <option value="System Design">Distributed System Design</option>
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
                <option value="Beginner">Beginner (Fundamentals)</option>
                <option value="Intermediate">Intermediate (Standard Tech Interview)</option>
                <option value="Advanced">Advanced (Staff / Senior)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <GlowButton onClick={handleStartQuiz} disabled={loading} icon={loading ? Loader2 : ArrowRight} size="lg">
              {loading ? "Generating Assessment..." : "Begin Assessment (2 ⚡)"}
            </GlowButton>
          </div>
        </GlassCard>
      )}

      {step === "active" && questions.length > 0 && (
        <GlassCard className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <Badge variant="amber">
              Question {currentIdx + 1} of {questions.length}
            </Badge>
            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Timed Mode</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
              {questions[currentIdx].questionText || questions[currentIdx].question}
            </h4>

            <div className="space-y-2.5">
              {questions[currentIdx].options.map((opt, optionIdx) => {
                const currentQuestionId = questions[currentIdx].id;
                const isSelected = userAnswers[currentQuestionId] === optionIdx;
                return (
                  <button
                    key={optionIdx}
                    onClick={() => handleSelectOption(currentQuestionId, optionIdx)}
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

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <GlowButton
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              variant="outline"
              size="sm"
            >
              Previous
            </GlowButton>

            {currentIdx < questions.length - 1 ? (
              <GlowButton onClick={() => setCurrentIdx((prev) => prev + 1)} size="sm">
                Next Question
              </GlowButton>
            ) : (
              <GlowButton onClick={handleSubmitAssessment} disabled={submitting} size="sm" icon={submitting ? Loader2 : CheckCircle2}>
                {submitting ? "Evaluating..." : "Submit Assessment"}
              </GlowButton>
            )}
          </div>
        </GlassCard>
      )}

      {step === "results" && scoreResult && (
        <GlassCard className="text-center space-y-6 py-6">
          <Badge variant={scoreResult.passed ? "emerald" : "sky"} icon={CheckCircle2}>
            Assessment Complete
          </Badge>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Skill Proficiency Report
          </h3>

          <div className="flex justify-center py-2">
            <ProgressRing progress={scoreResult.score} size={140} label={`${scoreResult.score}%`} color={scoreResult.passed ? "emerald" : "sky"} />
          </div>

          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium max-w-lg mx-auto">
            {scoreResult.feedback}
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
