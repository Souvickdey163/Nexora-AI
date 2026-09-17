"use client";

import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import {
  Play,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Cpu,
  BrainCircuit,
  MessageSquare,
  FileCode,
  Check,
  Copy,
  ChevronLeft,
  RefreshCw,
  Terminal,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  ShieldAlert,
  Layers,
} from "lucide-react";
import { codingApi, CodingProblemDTO, ExecutionResultDTO, CodingSubmissionHistoryItem } from "@/lib/api/coding";
import { useAuth } from "@/context/AuthContext";

// Dynamically import Monaco Editor with SSR disabled
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-slate-950 text-slate-400 gap-2 text-xs py-16">
      <RefreshCw className="w-4 h-4 animate-spin text-sky-500" />
      <span>Initializing Monaco Code Editor...</span>
    </div>
  ),
});

export default function ProblemSolvingPage({ params }: { params: Promise<{ problemId: string }> }) {
  const resolvedParams = use(params);
  const problemId = resolvedParams.problemId;
  const { user } = useAuth();

  // Problem State
  const [problem, setProblem] = useState<CodingProblemDTO | null>(null);
  const [isLoadingProblem, setIsLoadingProblem] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Editor State
  const [selectedLanguage, setSelectedLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>("");
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [activeLeftTab, setActiveLeftTab] = useState<"description" | "submissions" | "mentor">("description");
  const [showHints, setShowHints] = useState(false);

  // Execution State
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResultDTO | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"tests" | "logs" | "details">("tests");
  const [activeTestIndex, setActiveTestIndex] = useState<number>(0);

  // Auto-scroll / Focus Ref for execution result panel
  const resultPanelRef = useRef<HTMLDivElement>(null);

  // Refs for keyboard shortcuts in Monaco Editor
  const handleRunCodeRef = useRef<() => void>(() => {});
  const handleSubmitCodeRef = useRef<() => void>(() => {});

  // Submissions & Modal State
  const [submissions, setSubmissions] = useState<CodingSubmissionHistoryItem[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [selectedSubmissionCode, setSelectedSubmissionCode] = useState<CodingSubmissionHistoryItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // AI Mentor State
  const [mentorResponse, setMentorResponse] = useState<string | null>(null);
  const [isMentorLoading, setIsMentorLoading] = useState(false);

  // Load Problem Details
  useEffect(() => {
    loadProblemData();
  }, [problemId]);

  const loadProblemData = async () => {
    setIsLoadingProblem(true);
    setErrorMessage(null);

    const res = await codingApi.getProblem(problemId);
    if (res.success && res.data) {
      setProblem(res.data);
      const defaultLang = res.data.supportedLanguages[0] || "python";
      setSelectedLanguage(defaultLang);
      const starter = res.data.starterCode?.[defaultLang] || res.data.starterCode?.["python"] || "// Write solution here";
      setCode(starter);
      setCodeMap({ [defaultLang]: starter });
    } else {
      setErrorMessage(res.error || "Failed to load problem details.");
    }
    setIsLoadingProblem(false);
  };

  // Handle Language Change preserving custom written code
  const handleLanguageChange = (newLang: string) => {
    if (!problem) return;
    setCodeMap((prev) => ({ ...prev, [selectedLanguage]: code }));
    setSelectedLanguage(newLang);
    const existingCode = codeMap[newLang];
    if (existingCode) {
      setCode(existingCode);
    } else {
      const starter = problem.starterCode?.[newLang] || "// Write code here";
      setCode(starter);
      setCodeMap((prev) => ({ ...prev, [newLang]: starter }));
    }
  };

  // Reset Code to Original Starter Template
  const handleResetCode = () => {
    if (!problem) return;
    const starter = problem.starterCode?.[selectedLanguage] || "";
    setCode(starter);
    setCodeMap((prev) => ({ ...prev, [selectedLanguage]: starter }));
  };

  // Load Submissions History
  const loadSubmissions = async () => {
    setIsLoadingSubmissions(true);
    const res = await codingApi.getSubmissions(problemId);
    if (res.success && res.data) {
      setSubmissions(res.data);
    }
    setIsLoadingSubmissions(false);
  };

  useEffect(() => {
    if (activeLeftTab === "submissions" && user) {
      loadSubmissions();
    }
  }, [activeLeftTab, user]);

  // Scroll and focus result panel after execution
  const scrollAndFocusResultPanel = () => {
    setTimeout(() => {
      if (resultPanelRef.current) {
        resultPanelRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        resultPanelRef.current.focus();
      }
    }, 100);
  };

  // Run Code against Visible Test Cases Only
  const handleRunCode = async () => {
    if (!problem || isRunning || isSubmitting) return;

    setIsRunning(true);
    setExecutionResult(null);
    setErrorMessage(null);

    const res = await codingApi.runCode(problem.id, selectedLanguage, code);
    if (res.success && res.data) {
      setExecutionResult(res.data);
      setActiveTestIndex(0);
      setActiveResultTab("tests");
      scrollAndFocusResultPanel();
    } else {
      setErrorMessage(res.error || "Code execution failed.");
    }

    setIsRunning(false);
  };

  // Submit Code against All (Visible + Hidden) Test Cases
  const handleSubmitCode = async () => {
    if (!problem || isRunning || isSubmitting) return;

    setIsSubmitting(true);
    setExecutionResult(null);
    setErrorMessage(null);

    const res = await codingApi.submitCode(problem.id, selectedLanguage, code);
    if (res.success && res.data) {
      setExecutionResult(res.data.result);
      setActiveTestIndex(0);
      setActiveResultTab("tests");
      if (activeLeftTab === "submissions") loadSubmissions();
      scrollAndFocusResultPanel();
    } else {
      setErrorMessage(res.error || "Submission failed.");
    }

    setIsSubmitting(false);
  };

  // Sync ref values for Monaco key bindings
  useEffect(() => {
    handleRunCodeRef.current = handleRunCode;
    handleSubmitCodeRef.current = handleSubmitCode;
  });

  // Monaco Editor mount handler to bind Ctrl/Cmd+Enter and Shift+Enter
  const handleEditorMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleSubmitCodeRef.current();
    });
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, () => {
      handleRunCodeRef.current();
    });
  };

  // Query Nexus AI Mentor
  const handleAskMentor = async (
    queryType: "EXPLAIN_PROBLEM" | "HINT" | "EXPLAIN_ERROR" | "REVIEW_CODE" | "ANALYZE_COMPLEXITY" | "SUGGEST_OPTIMIZATION"
  ) => {
    if (!problem || isMentorLoading) return;

    setIsMentorLoading(true);
    setActiveLeftTab("mentor");
    setMentorResponse(null);

    const res = await codingApi.queryMentor({
      problemId: problem.id,
      queryType,
      language: selectedLanguage,
      userCode: code,
      executionResult: executionResult
        ? {
            status: executionResult.status,
            stderr: executionResult.stderr,
            compileOutput: executionResult.compileOutput,
            testsPassed: executionResult.testsPassed,
            totalTests: executionResult.totalTests,
          }
        : undefined,
    });

    if (res.success && res.data) {
      setMentorResponse(res.data.message);
    } else {
      setMentorResponse(`Error: ${res.error || "Failed to reach Nexus AI Mentor."}`);
    }

    setIsMentorLoading(false);
  };

  const getDifficultyBadge = (difficulty?: string) => {
    switch ((difficulty || "").toUpperCase()) {
      case "EASY":
        return <Badge variant="emerald">Easy</Badge>;
      case "MEDIUM":
        return <Badge variant="amber">Medium</Badge>;
      case "HARD":
        return <Badge variant="rose">Hard</Badge>;
      default:
        return <Badge variant="slate">{difficulty}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Accepted
          </span>
        );
      case "WRONG_ANSWER":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Wrong Answer
          </span>
        );
      case "COMPILATION_ERROR":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Compilation Error
          </span>
        );
      case "TIME_LIMIT_EXCEEDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
            <Clock className="w-3.5 h-3.5" />
            Time Limit Exceeded
          </span>
        );
      case "MEMORY_LIMIT_EXCEEDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Cpu className="w-3.5 h-3.5" />
            Memory Limit Exceeded
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <ShieldAlert className="w-3.5 h-3.5" />
            Runtime Error
          </span>
        );
    }
  };

  if (isLoadingProblem) {
    return (
      <FeatureLayout
        featureId="coding"
        title="Loading Workspace..."
        subtitle="Initializing problem statement, test cases, and Monaco editor environment..."
        category="Technical Mastery"
        hideHeaderNav={true}
      >
        <div className="py-28 text-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading problem environment...</p>
        </div>
      </FeatureLayout>
    );
  }

  if (errorMessage || !problem) {
    return (
      <FeatureLayout
        featureId="coding"
        title="Problem Unavailable"
        subtitle="The requested coding problem could not be loaded."
        category="Technical Mastery"
        hideHeaderNav={true}
      >
        <GlassCard className="p-8 text-center space-y-4 max-w-xl mx-auto my-12">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Failed to Load Problem</h3>
          <p className="text-xs text-slate-500">{errorMessage || "Invalid problem ID."}</p>
          <Link
            href="/features/coding"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 text-white font-semibold text-xs hover:bg-sky-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Problem Library</span>
          </Link>
        </GlassCard>
      </FeatureLayout>
    );
  }

  return (
    <FeatureLayout
      featureId="coding"
      title={problem.title}
      subtitle={`${problem.topic} • ${problem.difficulty} • ${problem.source}`}
      category="Coding Workspace"
      badge={problem.difficulty}
      hideHeaderNav={true}
    >
      <div className="flex flex-col space-y-6">
        {/* Workspace Top Action & Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/features/coding"
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors"
              title="Back to Problem Library"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {problem.title}
                </h2>
                {getDifficultyBadge(problem.difficulty)}
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {problem.topic} • {problem.testCases?.length || 0} Test Cases
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAskMentor("HINT")}
              disabled={isMentorLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold hover:bg-amber-500/20 transition-colors"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Ask Nexus AI</span>
            </button>
          </div>
        </div>

        {/* IDE Split Container: Desktop (Left: Problem/Submissions/Mentor, Right: Editor + Result Panel) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL (5 cols on lg): Tabs for Description, Submissions, Nexus AI */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <GlassCard className="p-4 space-y-4">
              {/* Tab Selector */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveLeftTab("description")}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    activeLeftTab === "description"
                      ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveLeftTab("submissions")}
                  className={`flex-1 py-1.5 rounded-lg transition-colors ${
                    activeLeftTab === "submissions"
                      ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Submissions
                </button>
                <button
                  onClick={() => setActiveLeftTab("mentor")}
                  className={`flex-1 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                    activeLeftTab === "mentor"
                      ? "bg-white dark:bg-slate-800 text-sky-500 shadow-sm font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Nexus AI</span>
                </button>
              </div>

              {/* TAB 1: DESCRIPTION */}
              {activeLeftTab === "description" && (
                <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
                  <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-line font-normal">
                    {problem.description}
                  </div>

                  {/* Examples */}
                  {problem.examples && Array.isArray(problem.examples) && problem.examples.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-sky-500" />
                        Examples
                      </h4>
                      <div className="space-y-3">
                        {problem.examples.map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 font-mono text-xs"
                          >
                            <div className="text-slate-900 dark:text-slate-200">
                              <span className="font-semibold text-sky-600 dark:text-sky-400">Input:</span> {ex.input}
                            </div>
                            <div className="text-slate-900 dark:text-slate-200">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">Output:</span> {ex.output}
                            </div>
                            {ex.explanation && (
                              <div className="text-slate-500 font-sans text-[11px] pt-1 border-t border-slate-200 dark:border-slate-800/60">
                                <span className="font-semibold text-slate-600 dark:text-slate-400">Explanation:</span> {ex.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Constraints */}
                  {problem.constraints && problem.constraints.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-amber-500" />
                        Constraints
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-600 dark:text-slate-400 pl-1">
                        {problem.constraints.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Optional Hints Section */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowHints(!showHints)}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-500/10 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Need a Hint?
                      </span>
                      {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    {showHints && (
                      <div className="mt-2 p-3.5 rounded-xl bg-slate-950 text-slate-300 text-xs space-y-2 font-mono border border-slate-800 animate-in fade-in duration-200">
                        <p>💡 Tip: Pay attention to edge cases like empty arrays, negative numbers, or maximum boundary values.</p>
                        <button
                          onClick={() => handleAskMentor("HINT")}
                          className="text-[11px] text-amber-400 hover:underline font-semibold block"
                        >
                          → Ask Nexus AI for detailed algorithmic hints
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SUBMISSIONS */}
              {activeLeftTab === "submissions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Submission History
                    </h4>
                    <button
                      onClick={loadSubmissions}
                      className="text-xs text-sky-500 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className={`w-3 h-3 ${isLoadingSubmissions ? "animate-spin" : ""}`} />
                      <span>Refresh</span>
                    </button>
                  </div>

                  {!user ? (
                    <div className="py-8 text-center space-y-2 text-xs text-slate-500">
                      <p>Sign in to track and view your past coding submissions.</p>
                    </div>
                  ) : isLoadingSubmissions ? (
                    <div className="py-8 text-center text-xs text-slate-400">Loading submission history...</div>
                  ) : submissions.length === 0 ? (
                    <div className="py-8 text-center space-y-2 text-xs text-slate-500">
                      <FileCode className="w-6 h-6 mx-auto text-slate-400" />
                      <p>No submissions recorded yet for this problem.</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => setSelectedSubmissionCode(sub)}
                          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-sky-500/50 transition-colors cursor-pointer group"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(sub.status)}
                              <span className="text-[11px] font-semibold uppercase text-slate-500">
                                {sub.language}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center gap-3">
                              <span>Passed: {sub.testsPassed} / {sub.totalTests}</span>
                              {sub.runtimeMs !== undefined && <span>{sub.runtimeMs}ms</span>}
                              {sub.memoryKb !== undefined && <span>{(sub.memoryKb / 1024).toFixed(1)}MB</span>}
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-400 text-right group-hover:text-sky-500 transition-colors">
                            {new Date(sub.createdAt).toLocaleDateString()}
                            <span className="block text-[9px]">Click to view code</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: NEXUS AI MENTOR */}
              {activeLeftTab === "mentor" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Nexus AI Coding Mentor
                    </h4>
                  </div>

                  {/* Mentor Actions Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAskMentor("EXPLAIN_PROBLEM")}
                      disabled={isMentorLoading}
                      className="p-2.5 rounded-xl bg-sky-500/5 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold hover:bg-sky-500/10 transition-colors text-left"
                    >
                      💡 Explain Problem
                    </button>
                    <button
                      onClick={() => handleAskMentor("HINT")}
                      disabled={isMentorLoading}
                      className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/10 transition-colors text-left"
                    >
                      🎯 Give Hint
                    </button>
                    <button
                      onClick={() => handleAskMentor("REVIEW_CODE")}
                      disabled={isMentorLoading}
                      className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors text-left"
                    >
                      🔍 Review Code
                    </button>
                    <button
                      onClick={() => handleAskMentor("ANALYZE_COMPLEXITY")}
                      disabled={isMentorLoading}
                      className="p-2.5 rounded-xl bg-purple-500/5 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-500/10 transition-colors text-left"
                    >
                      ⚡ Time & Space
                    </button>
                  </div>

                  {/* Mentor Output Area */}
                  {isMentorLoading ? (
                    <div className="p-4 rounded-xl bg-slate-950 text-slate-400 text-xs space-y-2 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                      <span>Nexus AI is analyzing your code and problem statement...</span>
                    </div>
                  ) : mentorResponse ? (
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs leading-relaxed font-mono whitespace-pre-wrap max-h-[350px] overflow-y-auto no-scrollbar">
                      {mentorResponse}
                    </div>
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-500 space-y-1">
                      <MessageSquare className="w-6 h-6 mx-auto text-slate-400" />
                      <p>Select an action above to get guidance from Nexus AI.</p>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          </div>

          {/* RIGHT PANEL (7 cols on lg): Monaco Editor & Result Panel */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Monaco Editor Container */}
            <GlassCard className="p-0 overflow-hidden flex flex-col">
              {/* Editor Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    {problem.supportedLanguages.map((lang) => (
                      <option key={lang} value={lang.toLowerCase()}>
                        {lang.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    (Shift+Enter: Run • Ctrl+Enter: Submit)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetCode}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
                    title="Reset to Starter Template"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  {/* Run Button */}
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning || isSubmitting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                        <span>Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                        <span>Run</span>
                      </>
                    )}
                  </button>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitCode}
                    disabled={isRunning || isSubmitting}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Monaco Editor Component */}
              <div className="h-[440px] w-full bg-slate-950">
                <MonacoEditor
                  height="100%"
                  language={selectedLanguage === "cpp" ? "cpp" : selectedLanguage === "typescript" ? "typescript" : selectedLanguage}
                  theme="vs-dark"
                  value={code}
                  onChange={(val) => setCode(val || "")}
                  onMount={handleEditorMount}
                  options={{
                    fontSize: 13,
                    lineNumbers: "on",
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    wordWrap: "on",
                    tabSize: 4,
                    automaticLayout: true,
                    smoothScrolling: true,
                    cursorBlinking: "smooth",
                  }}
                />
              </div>
            </GlassCard>

            {/* RESULT PANEL CONTAINER (Targeted for Auto-scroll & Focus) */}
            <div
              ref={resultPanelRef}
              tabIndex={-1}
              className="focus:outline-none scroll-mt-24 space-y-4"
            >
              {/* Error Message Callout */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Execution Result Panel */}
              {executionResult && (
                <GlassCard className="p-4 space-y-4 border-l-4 border-l-sky-500 animate-in fade-in duration-200">
                  {/* Result Header & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-3">
                      {getStatusBadge(executionResult.status)}
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Passed {executionResult.testsPassed} / {executionResult.totalTests} Test Cases
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        {executionResult.runtimeMs} ms
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3.5 h-3.5 text-purple-500" />
                        {(executionResult.memoryKb / 1024).toFixed(1)} MB
                      </span>
                      {executionResult.isMock && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          Dev Sandbox Execution
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Result View Tabs */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <button
                      onClick={() => setActiveResultTab("tests")}
                      className={`px-3 py-1.5 rounded-xl transition-colors ${
                        activeResultTab === "tests"
                          ? "bg-sky-500 text-white shadow-sm font-bold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      Test Results ({executionResult.testSummary.length})
                    </button>
                    {executionResult.stdout && (
                      <button
                        onClick={() => setActiveResultTab("logs")}
                        className={`px-3 py-1.5 rounded-xl transition-colors ${
                          activeResultTab === "logs"
                            ? "bg-sky-500 text-white shadow-sm font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        Output Logs
                      </button>
                    )}
                    {executionResult.compileOutput && (
                      <button
                        onClick={() => setActiveResultTab("details")}
                        className={`px-3 py-1.5 rounded-xl transition-colors ${
                          activeResultTab === "details"
                            ? "bg-amber-500 text-white shadow-sm font-bold"
                            : "text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                        }`}
                      >
                        Compiler Error
                      </button>
                    )}
                  </div>

                  {/* RESULT TAB 1: TEST CASES SUMMARY */}
                  {activeResultTab === "tests" && (
                    <div className="space-y-3">
                      {/* Test Selector Chips */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {executionResult.testSummary.map((tc, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveTestIndex(idx)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                              activeTestIndex === idx
                                ? tc.passed
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                  : "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                                : tc.passed
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            }`}
                          >
                            <span>Case {tc.testIndex}</span>
                            {tc.isHidden && <span className="text-[10px] opacity-75">(Hidden)</span>}
                            {tc.passed ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>

                      {/* Selected Test Case Detail Box */}
                      {executionResult.testSummary[activeTestIndex] && (
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-200">
                          {executionResult.testSummary[activeTestIndex].isHidden ? (
                            <div className="space-y-1.5 py-2 text-center text-slate-400">
                              <p className="font-semibold text-slate-300">🔒 Hidden Test Case {executionResult.testSummary[activeTestIndex].testIndex}</p>
                              <p className="text-[11px] font-sans text-slate-500">
                                Hidden test input and expected output remain secured to maintain evaluation integrity.
                              </p>
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                                  executionResult.testSummary[activeTestIndex].passed
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-rose-500/20 text-rose-400"
                                }`}
                              >
                                {executionResult.testSummary[activeTestIndex].passed ? "PASSED" : "FAILED"}
                              </span>
                            </div>
                          ) : (
                            <>
                              <div>
                                <span className="text-slate-400 font-bold">Input:</span>
                                <div className="p-2 mt-1 rounded-lg bg-slate-900 border border-slate-800 text-sky-400">
                                  {executionResult.testSummary[activeTestIndex].input}
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-400 font-bold">Actual Output:</span>
                                <div className="p-2 mt-1 rounded-lg bg-slate-900 border border-slate-800 text-white">
                                  {executionResult.testSummary[activeTestIndex].actualOutput}
                                </div>
                              </div>
                              {executionResult.testSummary[activeTestIndex].expectedOutput && (
                                <div>
                                  <span className="text-slate-400 font-bold">Expected Output:</span>
                                  <div className="p-2 mt-1 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400">
                                    {executionResult.testSummary[activeTestIndex].expectedOutput}
                                  </div>
                                </div>
                              )}
                              {executionResult.testSummary[activeTestIndex].error && (
                                <div className="pt-1 text-rose-400 text-[11px]">
                                  Error: {executionResult.testSummary[activeTestIndex].error}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* RESULT TAB 2: OUTPUT LOGS */}
                  {activeResultTab === "logs" && executionResult.stdout && (
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-[250px] overflow-y-auto no-scrollbar whitespace-pre-wrap">
                      {executionResult.stdout}
                    </div>
                  )}

                  {/* RESULT TAB 3: COMPILER / RUNTIME ERROR LOGS */}
                  {activeResultTab === "details" && executionResult.compileOutput && (
                    <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 font-mono text-xs text-rose-300 leading-relaxed max-h-[250px] overflow-y-auto no-scrollbar whitespace-pre-wrap">
                      {executionResult.compileOutput}
                    </div>
                  )}
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SUBMISSION CODE INSPECTOR MODAL */}
      {selectedSubmissionCode && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedSubmissionCode(null)}
          title={`Submission Details - ${new Date(selectedSubmissionCode.createdAt).toLocaleDateString()}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedSubmissionCode.status)}
                <span className="font-bold text-slate-900 dark:text-white uppercase">
                  {selectedSubmissionCode.language}
                </span>
              </div>
              <div className="font-mono text-slate-500">
                Tests: {selectedSubmissionCode.testsPassed} / {selectedSubmissionCode.totalTests}
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedSubmissionCode.language);
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? "Copied" : "Copy Code"}</span>
              </button>

              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed max-h-[400px] overflow-y-auto no-scrollbar">
                <code>{`// Code submitted on ${new Date(selectedSubmissionCode.createdAt).toLocaleString()}\n// Language: ${selectedSubmissionCode.language}\n// Status: ${selectedSubmissionCode.status}\n\n${selectedSubmissionCode.language}`}</code>
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </FeatureLayout>
  );
}
