"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Award,
  BookOpen,
  RotateCcw,
  Target,
  Loader2,
  History,
  Layers,
  HelpCircle,
} from "lucide-react";
import {
  quizApi,
  QuizSession,
  QuizReport,
  QuizMockTestSummary,
  ClientQuizQuestion,
} from "@/lib/api/quiz";

export function QuizMockTestWorkspace() {
  const [view, setView] = useState<"setup" | "test_room" | "report" | "history">("setup");

  // Setup options
  const [categories, setCategories] = useState<string[]>([
    "Linux",
    "DevOps",
    "Docker",
    "Kubernetes",
    "SQL",
    "JavaScript",
    "Python",
    "PHP",
    "HTML",
    "CSS",
    "React",
    "Node.js",
    "Networking",
    "Security",
  ]);
  const [recommendedTopics, setRecommendedTopics] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("JavaScript");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Medium");
  const [selectedLimit, setSelectedLimit] = useState(10);
  const [loadingSetup, setLoadingSetup] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Test Room State
  const [session, setSession] = useState<QuizSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // questionId -> optionId
  const [timerSeconds, setTimerSeconds] = useState(15 * 60); // 15 mins
  const [submitting, setSubmitting] = useState(false);

  // Report State
  const [report, setReport] = useState<QuizReport | null>(null);

  // History State
  const [history, setHistory] = useState<QuizMockTestSummary[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Load recommended topics on mount
  useEffect(() => {
    const loadCategories = async () => {
      const res = await quizApi.getCategories();
      if (res.success && res.recommendedTopics) {
        setRecommendedTopics(res.recommendedTopics);
        if (res.recommendedTopics.length > 0) {
          setSelectedCategory(res.recommendedTopics[0]);
        }
      }
    };
    loadCategories();
  }, []);

  // Timer countdown during test
  useEffect(() => {
    if (view !== "test_room" || timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [view, timerSeconds]);

  const handleStartTest = async () => {
    setLoadingSetup(true);
    setErrorMsg(null);

    const res = await quizApi.generateMockTest({
      category: selectedCategory,
      difficulty: selectedDifficulty,
      limit: selectedLimit,
    });

    setLoadingSetup(false);

    if (res.success && res.testSession) {
      setSession(res.testSession);
      setCurrentIndex(0);
      setUserAnswers({});
      setTimerSeconds(selectedLimit * 90); // 1.5 mins per question
      setView("test_room");
    } else {
      setErrorMsg(res.error || "Failed to generate mock test questions from QuizAPI.");
    }
  };

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitTest = async () => {
    if (!session || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);

    const result = await quizApi.submitMockTest(session.testId, userAnswers);
    setSubmitting(false);

    if (result.success) {
      setReport(result);
      setView("report");
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setErrorMsg(result.error || "Failed to evaluate test submission.");
    }
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    const res = await quizApi.getMockTestHistory();
    if (res.success && res.history) {
      setHistory(res.history);
    }
    setLoadingHistory(false);
  };

  const openHistoryView = () => {
    fetchHistory();
    setView("history");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const currentQuestion: ClientQuizQuestion | null =
    session && session.questions ? session.questions[currentIndex] : null;

  return (
    <div className="space-y-6">
      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* SETUP VIEW */}
      {view === "setup" && (
        <div className="space-y-6">
          <GlassCard className="space-y-6 border-indigo-500/20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    QuizAPI Technical MCQ Mock Test
                    <Badge variant="purple" size="sm">
                      QuizAPI Integrated
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Test your technical knowledge with real-time multiple-choice assessments powered by QuizAPI.
                  </p>
                </div>
              </div>

              <GlowButton size="sm" variant="outline" icon={History} onClick={openHistoryView}>
                View Session History
              </GlowButton>
            </div>

            {/* Resume Recommended Topics if available */}
            {recommendedTopics.length > 0 && (
              <div className="space-y-2 bg-indigo-500/5 dark:bg-indigo-500/10 p-3.5 rounded-2xl border border-indigo-500/20">
                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                  <Target className="w-4 h-4" /> Recommended for Your Resume Skills:
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {recommendedTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSelectedCategory(topic)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === topic
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      ★ {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Selection Grid */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Select Technical Subject / Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-2xl border text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      selectedCategory === cat
                        ? "bg-gradient-to-br from-indigo-500 to-sky-500 text-white border-sky-400 shadow-md shadow-indigo-500/20"
                        : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Controls: Difficulty & Limit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Difficulty Level
                </label>
                <div className="flex gap-2">
                  {["Easy", "Medium", "Hard"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors capitalize ${
                        selectedDifficulty === diff
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Number of Questions
                </label>
                <div className="flex gap-2">
                  {[5, 10, 15, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSelectedLimit(num)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                        selectedLimit === num
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                      }`}
                    >
                      {num} Questions
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <GlowButton
                size="lg"
                icon={loadingSetup ? Loader2 : Sparkles}
                onClick={handleStartTest}
                disabled={loadingSetup}
              >
                {loadingSetup ? "Fetching QuizAPI Questions..." : `Start ${selectedCategory} Mock Test`}
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* TEST ROOM VIEW */}
      {view === "test_room" && session && currentQuestion && (
        <div className="space-y-6">
          {/* Header Bar */}
          <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-3">
              <Badge variant="purple" size="md">
                {session.category}
              </Badge>
              <Badge variant="sky" size="md">
                {session.difficulty}
              </Badge>
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} of {session.totalQuestions}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-indigo-500">
                <Clock className="w-4 h-4" /> Time Left: {formatTimer(timerSeconds)}
              </div>
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
              >
                Submit Test
              </button>
            </div>
          </GlassCard>

          {/* Question Card */}
          <GlassCard className="space-y-6 border-indigo-500/30">
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider">
                Question #{currentIndex + 1}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
                {currentQuestion.question}
              </h3>
              {currentQuestion.description && (
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 p-3 rounded-xl">
                  {currentQuestion.description}
                </p>
              )}
            </div>

            {/* Options Selection */}
            <div className="space-y-3">
              {currentQuestion.answers.map((opt, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === opt.id;
                const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectAnswer(currentQuestion.id, opt.id)}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500 text-slate-900 dark:text-white shadow-md"
                        : "bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {optionLabel}
                      </div>
                      <span className="text-xs font-semibold leading-normal">{opt.text}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-indigo-500 bg-indigo-500" : "border-slate-400"
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="text-xs font-bold text-slate-400">
                Answered {Object.keys(userAnswers).length} of {session.totalQuestions}
              </div>

              {currentIndex < session.totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => prev + 1)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  {submitting ? "Evaluating..." : "Submit Mock Test"}
                </button>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* REPORT VIEW */}
      {view === "report" && report && (
        <div className="space-y-6">
          <GlassCard className="space-y-6 border-emerald-500/30">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Award className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Mock Test Report Scorecard
                    <Badge variant={report.accuracyPct >= 70 ? "emerald" : "amber"} size="md">
                      {report.accuracyPct}% Accuracy
                    </Badge>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {report.category} • Difficulty: {report.difficulty} • Completed on {new Date(report.completedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <GlowButton size="sm" variant="outline" icon={RotateCcw} onClick={() => setView("setup")}>
                  Take Another Test
                </GlowButton>
              </div>
            </div>

            {/* Scorecard Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Score</span>
                <div className="text-2xl font-black text-indigo-500">
                  {report.score} / {report.totalQuestions}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Accuracy</span>
                <div className="text-2xl font-black text-emerald-400">{report.accuracyPct}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Correct</span>
                <div className="text-2xl font-black text-emerald-500">{report.correctAnswers}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Incorrect</span>
                <div className="text-2xl font-black text-rose-400">{report.incorrectAnswers}</div>
              </div>
            </div>

            {/* Topic Performance */}
            {Object.keys(report.topicScores).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Topic Performance Breakdown
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(report.topicScores).map(([topic, pct]) => (
                    <div
                      key={topic}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border ${
                        pct >= 70
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      <span>{topic}:</span>
                      <span>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Question Review List */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Question & Answer Review ({report.questions.length})
              </h4>

              <div className="space-y-4">
                {report.questions.map((q, idx) => {
                  const correctOpt = q.answers.find((a) => a.id === q.correctAnswer);
                  const selectedOpt = q.answers.find((a) => a.id === q.selectedAnswer);

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-2xl border-2 space-y-3 ${
                        q.isCorrect
                          ? "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/30"
                          : "bg-rose-500/5 dark:bg-rose-500/10 border-rose-500/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-400">Question #{idx + 1}</div>
                          <h5 className="text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
                            {q.question}
                          </h5>
                        </div>

                        <Badge variant={q.isCorrect ? "emerald" : "rose"} size="sm">
                          {q.isCorrect ? "Correct ✓" : "Incorrect ✕"}
                        </Badge>
                      </div>

                      {/* Answers comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Your Answer:</span>
                          <span className={q.isCorrect ? "font-bold text-emerald-400" : "font-bold text-rose-400"}>
                            {selectedOpt ? selectedOpt.text : "No answer selected"}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block">Correct Answer:</span>
                          <span className="font-bold text-emerald-400">
                            {correctOpt ? correctOpt.text : q.correctAnswer}
                          </span>
                        </div>
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 space-y-1">
                          <span className="font-bold text-indigo-400 flex items-center gap-1">
                            <HelpCircle className="w-3.5 h-3.5" /> Explanation:
                          </span>
                          <p className="leading-relaxed text-[11px]">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* HISTORY VIEW */}
      {view === "history" && (
        <div className="space-y-6">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Past Mock Test History
                  </h3>
                  <p className="text-xs text-slate-500">Your completed QuizAPI mock test sessions.</p>
                </div>
              </div>

              <GlowButton size="sm" variant="outline" onClick={() => setView("setup")}>
                Back to Setup
              </GlowButton>
            </div>

            {loadingHistory ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-400">Loading session history...</p>
              </div>
            ) : history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-10">No completed mock tests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Difficulty</th>
                      <th className="py-3 px-4">Questions</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {history.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-extrabold text-slate-900 dark:text-white">{h.category}</td>
                        <td className="py-3 px-4">
                          <Badge variant="sky" size="sm">
                            {h.difficulty}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-400">{h.totalQuestions} Questions</td>
                        <td className="py-3 px-4 font-bold text-indigo-400">{h.score}/{h.totalQuestions}</td>
                        <td className="py-3 px-4 font-bold text-emerald-400">{h.accuracyPct}%</td>
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(h.completedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
