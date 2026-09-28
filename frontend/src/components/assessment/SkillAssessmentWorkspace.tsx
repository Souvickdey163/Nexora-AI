"use client";

import React, { useState, useEffect, useRef } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Modal } from "@/components/ui/Modal";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  BarChart3,
  FileText,
  Layers,
  HelpCircle,
  X,
  History,
  Check,
} from "lucide-react";
import { assessmentApi } from "@/lib/api/assessment";
import { useAuth } from "@/context/AuthContext";
import { InsufficientCreditsModal } from "@/components/common/InsufficientCreditsModal";

type AssessmentStep = "select" | "active" | "results";

interface Question {
  id: string;
  category: string;
  topic?: string;
  difficulty: string;
  questionText: string;
  options: string[];
}

export function SkillAssessmentWorkspace() {
  const { refreshUser } = useAuth();
  const [step, setStep] = useState<AssessmentStep>("select");
  const [selectedCategory, setSelectedCategory] = useState("DBMS & SQL");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [questionTimeMap, setQuestionTimeMap] = useState<Record<string, number>>({});
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insufficientCreditsError, setInsufficientCreditsError] = useState<{ required: number; current: number } | null>(null);

  const [integrityAlert, setIntegrityAlert] = useState<string | null>(null);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const [resultData, setResultData] = useState<any | null>(null);
  const questionStartTimeRef = useRef<number>(Date.now());

  // Check for active session on load
  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    try {
      const res = await assessmentApi.getActiveSession();
      if (res.success && res.activeSession) {
        const active = res.activeSession;
        setAssessmentId(active.assessmentId);
        setSelectedCategory(active.category);
        setDifficulty(active.difficulty);
        setQuestions(active.questions);
        setExpiresAt(active.expiresAt);

        const initialAnsMap: Record<string, number> = {};
        const initialTimeMap: Record<string, number> = {};
        if (Array.isArray(active.answersData)) {
          active.answersData.forEach((ans: any) => {
            initialAnsMap[ans.questionId] = ans.selectedOptionIndex;
            initialTimeMap[ans.questionId] = ans.timeSpentSeconds || 0;
          });
        }
        setUserAnswers(initialAnsMap);
        setQuestionTimeMap(initialTimeMap);
        setStep("active");
        setCurrentIdx(0);
      }
    } catch (err) {
      // Ignore initial session fetch error
    }
  };

  // Timer countdown hook
  useEffect(() => {
    if (step !== "active" || !expiresAt) return;

    const updateTimer = () => {
      const remainingMs = new Date(expiresAt).getTime() - Date.now();
      const secs = Math.max(0, Math.floor(remainingMs / 1000));
      setSecondsRemaining(secs);

      if (secs <= 0 && !submitting) {
        handleAutoSubmitOnExpire();
      }
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [step, expiresAt, submitting]);

  // Track time spent per question
  useEffect(() => {
    if (step !== "active" || questions.length === 0) return;
    questionStartTimeRef.current = Date.now();

    return () => {
      if (questions[currentIdx]) {
        const elapsedSec = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
        const qId = questions[currentIdx].id;
        setQuestionTimeMap((prev) => ({
          ...prev,
          [qId]: (prev[qId] || 0) + Math.max(1, elapsedSec),
        }));
      }
    };
  }, [currentIdx, step, questions]);

  // Integrity Monitoring Hook (Fullscreen, blur, focus, tab switch)
  useEffect(() => {
    if (step !== "active" || !assessmentId) return;

    const logEvent = (eventType: string, details?: string) => {
      assessmentApi.logIntegrityEvent(assessmentId, eventType, details);
    };

    const handleBlur = () => {
      setIntegrityAlert(`Window focus lost / tab switched at ${new Date().toLocaleTimeString()}`);
      logEvent("WINDOW_BLUR", "Focus lost");
    };

    const handleFocus = () => {
      logEvent("WINDOW_FOCUS", "Focus restored");
    };

    const handleVisibility = () => {
      if (document.hidden) {
        setIntegrityAlert(`Tab hidden at ${new Date().toLocaleTimeString()}`);
        logEvent("TAB_HIDDEN", "User switched away from tab");
      } else {
        logEvent("TAB_VISIBLE", "Tab visible again");
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIntegrityAlert(`Exited fullscreen proctored mode at ${new Date().toLocaleTimeString()}`);
        logEvent("FULLSCREEN_EXIT", "User exited fullscreen mode");
      } else {
        logEvent("FULLSCREEN_ENTER", "User entered fullscreen mode");
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [step, assessmentId]);

  const requestFullscreen = () => {
    if (typeof window !== "undefined" && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const handleStartAssessment = async () => {
    setLoading(true);
    setError(null);
    setIntegrityAlert(null);
    setInsufficientCreditsError(null);

    requestFullscreen();

    const res = await assessmentApi.startAssessment({
      category: selectedCategory,
      difficulty,
      questionCount: 10,
    });

    if (res.success && res.questions && res.assessmentId) {
      setAssessmentId(res.assessmentId);
      setQuestions(res.questions);
      setExpiresAt(res.expiresAt || null);
      setCurrentIdx(0);
      setUserAnswers({});
      setQuestionTimeMap({});
      setStep("active");
      await refreshUser();
    } else if (res.code === "INSUFFICIENT_CREDITS") {
      setInsufficientCreditsError({
        required: res.requiredCredits || 2,
        current: res.currentCredits || 0,
      });
    } else {
      setError(res.error || "Failed to start assessment.");
    }
    setLoading(false);
  };

  const handleSelectOption = async (questionId: string, optionIndex: number) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));

    if (assessmentId) {
      const elapsed = Math.round((Date.now() - questionStartTimeRef.current) / 1000);
      const totalSpent = (questionTimeMap[questionId] || 0) + Math.max(1, elapsed);
      await assessmentApi.saveAnswer(assessmentId, questionId, optionIndex, totalSpent);
    }
  };

  const handleAutoSubmitOnExpire = async () => {
    if (submitting || !assessmentId) return;
    setSubmitting(true);
    setIntegrityAlert("Session timer expired. Automatically submitting your assessment...");

    const res = await assessmentApi.submitAssessment(assessmentId);
    if (res.success && res.result) {
      setResultData(res.result);
      setStep("results");
      await refreshUser();
    }
    setSubmitting(false);
  };

  const handleSubmitAssessment = async () => {
    if (!assessmentId) return;
    setSubmitting(true);
    setError(null);
    setShowConfirmSubmitModal(false);

    // Prepare final answer array
    const finalAnswers = Object.entries(userAnswers).map(([qId, optIdx]) => ({
      questionId: qId,
      selectedOptionIndex: optIdx,
      timeSpentSeconds: questionTimeMap[qId] || 15,
    }));

    const res = await assessmentApi.submitAssessment(assessmentId, finalAnswers);

    if (res.success && res.result) {
      setResultData(res.result);
      setStep("results");
      await refreshUser();
    } else {
      setError(res.error || "Failed to submit assessment.");
    }
    setSubmitting(false);
  };

  const handleOpenHistory = async () => {
    setIsLoadingHistory(true);
    setShowHistoryModal(true);
    const res = await assessmentApi.getHistory();
    if (res.success && res.attempts) {
      setHistoryList(res.attempts);
    }
    setIsLoadingHistory(false);
  };

  const handleViewHistoricalResult = async (histAttemptId: string) => {
    setShowHistoryModal(false);
    setLoading(true);
    const res = await assessmentApi.getResult(histAttemptId);
    if (res.success && res.result) {
      setResultData(res.result);
      setStep("results");
    }
    setLoading(false);
  };

  const formatTimerStr = (secs: number | null) => {
    if (secs === null) return "--:--";
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {insufficientCreditsError && (
        <InsufficientCreditsModal
          isOpen={!!insufficientCreditsError}
          onClose={() => setInsufficientCreditsError(null)}
          requiredCredits={insufficientCreditsError.required}
          currentCredits={insufficientCreditsError.current}
        />
      )}

      {/* STEP 1: CONFIGURATION & LAUNCHER */}
      {step === "select" && (
        <GlassCard className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Diagnostic Skill Assessment
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Evaluate your core Computer Science domain mastery. (Costs 2 ⚡)
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenHistory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              <History className="w-4 h-4 text-sky-500" />
              <span>View Benchmark History</span>
            </button>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Assessment Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              >
                <option value="DBMS & SQL">DBMS & SQL</option>
                <option value="DSA">DSA / Data Structures & Algorithms</option>
                <option value="Operating Systems">Operating Systems & Concurrency</option>
                <option value="Computer Networks">Computer Networks & HTTP/TCP</option>
                <option value="System Design">System Design & Distributed Architecture</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
              >
                <option value="Beginner">Beginner (Core Fundamentals)</option>
                <option value="Intermediate">Intermediate (Technical Interview Level)</option>
                <option value="Advanced">Advanced (Deep Concepts & Trade-offs)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 text-xs space-y-2 font-sans">
            <div className="flex items-center gap-2 font-bold text-sky-400">
              <ShieldAlert className="w-4 h-4 text-sky-400" />
              <span>Assessment Environment Specifications</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Includes 10 dynamic multiple-choice questions matching selected domain and difficulty.</li>
              <li>15-minute server-synced countdown timer. Auto-submits upon completion or expiration.</li>
              <li>Responses are automatically saved to your account in real-time.</li>
              <li>Proctored browser integrity tracking logs tab-switches and fullscreen events.</li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <GlowButton onClick={handleStartAssessment} disabled={loading} icon={loading ? Loader2 : ArrowRight} size="lg">
              {loading ? "Generating Assessment..." : "Begin Assessment (2 ⚡)"}
            </GlowButton>
          </div>
        </GlassCard>
      )}

      {/* STEP 2: ACTIVE ASSESSMENT WORKSPACE */}
      {step === "active" && questions.length > 0 && (
        <GlassCard className="space-y-6">
          {/* Integrity Warning Alert */}
          {integrityAlert && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>⚠️ {integrityAlert}</span>
              </span>
              <button onClick={() => setIntegrityAlert(null)} className="text-xs font-bold underline ml-3 shrink-0">
                Dismiss
              </button>
            </div>
          )}

          {/* Top Info Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Badge variant="emerald">{selectedCategory}</Badge>
              <Badge variant="amber">{difficulty}</Badge>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={requestFullscreen} className="text-slate-400 hover:text-sky-400 transition-colors p-1" title="Enter Fullscreen Proctored Mode">
                <Maximize2 className="w-4 h-4" />
              </button>

              <div
                className={`flex items-center gap-2 font-mono text-sm font-extrabold px-3 py-1 rounded-xl border ${
                  secondsRemaining !== null && secondsRemaining < 120
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse"
                    : "bg-slate-900 text-emerald-400 border-slate-800"
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTimerStr(secondsRemaining)}</span>
              </div>
            </div>
          </div>

          {/* Question Navigation Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
              <span>Question Navigation Grid</span>
              <span>
                {answeredCount} of {questions.length} Answered
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {questions.map((q, idx) => {
                const isAns = userAnswers[q.id] !== undefined;
                const isCur = idx === currentIdx;
                return (
                  <button
                    key={q.id || idx}
                    onClick={() => setCurrentIdx(idx)}
                    className={`w-9 h-9 rounded-xl font-mono text-xs font-bold transition-all ${
                      isCur
                        ? "bg-sky-500 text-white shadow-md shadow-sky-500/20 ring-2 ring-sky-400"
                        : isAns
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Display */}
          <div className="space-y-5 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-sky-500 uppercase tracking-wider">
                Topic: {questions[currentIdx].topic || selectedCategory}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Question {currentIdx + 1} / {questions.length}
              </span>
            </div>

            <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
              {questions[currentIdx].questionText}
            </h4>

            {/* Options List */}
            <div className="space-y-3">
              {questions[currentIdx].options.map((opt, optionIdx) => {
                const qId = questions[currentIdx].id;
                const isSelected = userAnswers[qId] === optionIdx;
                return (
                  <button
                    key={optionIdx}
                    onClick={() => handleSelectOption(qId, optionIdx)}
                    className={`w-full text-left p-4 rounded-2xl text-xs font-semibold border transition-all flex items-center justify-between group ${
                      isSelected
                        ? "bg-sky-500/15 text-sky-600 dark:text-sky-300 border-sky-500/50 shadow-sm ring-1 ring-sky-500/30"
                        : "bg-slate-100/80 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-sky-500/40 hover:bg-slate-200/50 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-6 h-6 rounded-lg font-mono font-bold text-[11px] flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-sky-500 text-white"
                            : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:text-sky-500"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIdx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Question Action Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <GlowButton
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((prev) => prev - 1)}
              variant="outline"
              size="sm"
              icon={ChevronLeft}
            >
              Previous
            </GlowButton>

            <div className="flex items-center gap-2">
              {currentIdx < questions.length - 1 ? (
                <GlowButton onClick={() => setCurrentIdx((prev) => prev + 1)} size="sm">
                  <span>Next Question</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </GlowButton>
              ) : (
                <GlowButton
                  onClick={() => setShowConfirmSubmitModal(true)}
                  disabled={submitting}
                  size="sm"
                  icon={submitting ? Loader2 : CheckCircle2}
                >
                  {submitting ? "Evaluating..." : "Submit Assessment"}
                </GlowButton>
              )}
            </div>
          </div>
        </GlassCard>
      )}

      {/* CONFIRMATION SUBMISSION MODAL */}
      <Modal
        isOpen={showConfirmSubmitModal}
        onClose={() => setShowConfirmSubmitModal(false)}
        title="Submit Diagnostic Assessment?"
      >
        <div className="space-y-4 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
          <p>
            You have answered <span className="font-bold text-sky-400">{answeredCount}</span> of{" "}
            <span className="font-bold">{questions.length}</span> questions.
          </p>
          {answeredCount < questions.length && (
            <p className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 font-semibold">
              ⚠️ You have {questions.length - answeredCount} unanswered questions. Unanswered questions will be scored as incorrect.
            </p>
          )}
          <p>Are you sure you want to finish and generate your domain skill report?</p>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setShowConfirmSubmitModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
            >
              Continue Working
            </button>
            <GlowButton onClick={handleSubmitAssessment} disabled={submitting} icon={submitting ? Loader2 : CheckCircle2}>
              {submitting ? "Evaluating..." : "Confirm & Submit"}
            </GlowButton>
          </div>
        </div>
      </Modal>

      {/* BENCHMARK HISTORY MODAL */}
      <Modal isOpen={showHistoryModal} onClose={() => setShowHistoryModal(false)} title="Historical Diagnostic Benchmarks">
        <div className="space-y-4">
          {isLoadingHistory ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-sky-500 mx-auto" />
              <p>Loading assessment history...</p>
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <p>No historical assessment records found.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
              {historyList.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-sky-500/40 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {attempt.category}
                      </span>
                      <Badge variant="amber">{attempt.difficulty}</Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>{new Date(attempt.completedAt || attempt.createdAt).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <span>Correct: {attempt.correctAnswers}/{attempt.totalQuestions}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block font-mono">
                        {attempt.score}%
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">Score</span>
                    </div>

                    <button
                      onClick={() => handleViewHistoricalResult(attempt.id)}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/10 text-sky-500 text-xs font-bold hover:bg-sky-500/20 transition-colors"
                    >
                      Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* STEP 3: RESULTS DASHBOARD (PRODUCTION QUALITY - NO FAKE DATA) */}
      {step === "results" && resultData && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Hero Overall Score Banner */}
          <GlassCard className="text-center space-y-6 py-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-left">
                <Badge variant={resultData.score >= 70 ? "emerald" : "amber"}>
                  {resultData.category} • {resultData.difficulty}
                </Badge>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {new Date(resultData.completedAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Computer Science Skill Diagnostic Report
            </h3>

            <div className="flex justify-center py-2">
              <ProgressRing
                progress={resultData.score}
                size={150}
                label={`${resultData.score}%`}
                color={resultData.score >= 70 ? "emerald" : "sky"}
              />
            </div>

            {/* Performance Summary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-2xl mx-auto pt-2">
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-lg font-extrabold text-emerald-500 block font-mono">
                  {resultData.correctAnswers}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Correct</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-lg font-extrabold text-rose-500 block font-mono">
                  {resultData.incorrectAnswers}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Incorrect</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-lg font-extrabold text-slate-400 block font-mono">
                  {resultData.unansweredCount}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Unanswered</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-lg font-extrabold text-sky-400 block font-mono">
                  {resultData.accuracyPct}%
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Accuracy</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-lg font-extrabold text-amber-400 block font-mono">
                  {resultData.avgTimePerQuestion}s
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Avg / Question</span>
              </div>
            </div>
          </GlassCard>

          {/* Domain & Topic Proficiency Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain Proficiency Matrix */}
            <GlassCard className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <BarChart3 className="w-5 h-5 text-sky-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Domain Proficiency Matrix
                </h4>
              </div>

              <div className="space-y-3 pt-1">
                {Object.entries(resultData.domainScores || {}).map(([domainName, dScore]) => (
                  <div key={domainName} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>{domainName}</span>
                      <span className="font-mono text-sky-400">{dScore as number}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full transition-all duration-500"
                        style={{ width: `${dScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Topic Strengths & Weaknesses */}
            <GlassCard className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Topic-Level Analysis
                </h4>
              </div>

              <div className="space-y-3">
                {/* Topic Breakdown */}
                {Object.entries(resultData.topicAnalysis || {}).map(([tName, tStat]: any) => (
                  <div key={tName} className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">{tName}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {tStat.correct} / {tStat.total} Correct
                      </span>
                    </div>
                    <Badge variant={tStat.status === "STRONG" ? "emerald" : "amber"}>
                      {tStat.accuracyPct}%
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* AI Mentor Natural Language Report & Recommendations */}
          {resultData.aiReport && (
            <GlassCard className="space-y-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Nexus AI Mentor Evaluation & Recommendations
                </h4>
              </div>

              {resultData.aiReport.summary && (
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  {resultData.aiReport.summary}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Recommended Next Steps */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5" />
                    Recommended Next Steps
                  </h5>
                  <ul className="space-y-2">
                    {(resultData.aiReport.recommendedNextSteps || resultData.recommendations || []).map((stepItem: string, idx: number) => (
                      <li key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                        <span>{stepItem}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested Study Topics */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" />
                    Focus Areas & Weak Subtopics
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {(resultData.weakAreas || []).map((weak: string, idx: number) => (
                      <Badge key={idx} variant="rose">
                        {weak}
                      </Badge>
                    ))}
                    {(resultData.weakAreas || []).length === 0 && (
                      <span className="text-xs text-emerald-400 font-bold">No critical weak topics detected! Excellent work.</span>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Detailed Question Review Accordion */}
          {resultData.questionDetails && resultData.questionDetails.length > 0 && (
            <GlassCard className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                <FileText className="w-5 h-5 text-sky-500" />
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Detailed Question Breakdown & Explanations
                </h4>
              </div>

              <div className="space-y-4">
                {resultData.questionDetails.map((qDetail: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border space-y-3 text-xs ${
                      qDetail.isCorrect
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-rose-500/5 border-rose-500/20"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold font-mono text-sky-400">
                        Q{idx + 1}. {qDetail.topic || resultData.category}
                      </span>
                      <Badge variant={qDetail.isCorrect ? "emerald" : "rose"} icon={qDetail.isCorrect ? CheckCircle2 : XCircle}>
                        {qDetail.isCorrect ? "Correct (+1)" : "Incorrect"}
                      </Badge>
                    </div>

                    <p className="font-extrabold text-slate-900 dark:text-white leading-snug">
                      {qDetail.questionText}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      {qDetail.options && qDetail.options.map((opt: string, optIdx: number) => {
                        const isUserSel = qDetail.selectedOptionIndex === optIdx;
                        const isCorrOpt = qDetail.correctOptionIndex === optIdx;
                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-xl flex items-center justify-between text-xs font-semibold ${
                              isCorrOpt
                                ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/40"
                                : isUserSel
                                ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/40"
                                : "text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            <span>
                              <span className="font-mono font-bold mr-2">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                            </span>
                            {isCorrOpt && <span className="text-[10px] font-bold text-emerald-400">✓ Correct Answer</span>}
                            {isUserSel && !isCorrOpt && <span className="text-[10px] font-bold text-rose-400">✗ Your Choice</span>}
                          </div>
                        );
                      })}
                    </div>

                    {qDetail.explanation && (
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-[11px] leading-relaxed pt-2">
                        <span className="font-bold text-sky-400 block mb-1">💡 Technical Explanation:</span>
                        {qDetail.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-4">
            <button
              onClick={handleOpenHistory}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              <History className="w-4 h-4 text-sky-500" />
              <span>View Benchmark History</span>
            </button>

            <GlowButton onClick={() => setStep("select")} icon={RefreshCw} size="md">
              Take Another Assessment
            </GlowButton>
          </div>
        </div>
      )}
    </div>
  );
}
