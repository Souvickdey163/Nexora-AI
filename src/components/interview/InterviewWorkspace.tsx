"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import {
  Video,
  Mic,
  MicOff,
  Play,
  Square,
  Sparkles,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  User,
  ChevronRight,
  Volume2,
} from "lucide-react";

type InterviewStep = "setup" | "active" | "results";

export function InterviewWorkspace() {
  const [step, setStep] = useState<InterviewStep>("setup");

  // Setup Form State
  const [jobRole, setJobRole] = useState("Full Stack Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level (2-5 yrs)");
  const [interviewType, setInterviewType] = useState("Technical & System Design");
  const [duration, setDuration] = useState("30 Minutes");

  // Active Interview State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 mins per question
  const [micActive, setMicActive] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [userSpeech, setUserSpeech] = useState("");

  const questions = [
    {
      id: 1,
      type: "Technical",
      question:
        "Can you explain how you handle state management and concurrency in a high-traffic Next.js and Node.js application?",
      hint: "Mention Server Components, React Context, Redis caching, and optimistic UI updates.",
    },
    {
      id: 2,
      type: "System Design",
      question:
        "How would you design a scalable rate limiting service for an API gateway handling 100,000 requests per second?",
      hint: "Discuss Sliding Window Log algorithm, Token Bucket, Redis cluster, and HTTP 429 status response headers.",
    },
    {
      id: 3,
      type: "Behavioral",
      question:
        "Describe a situation where a critical database migration failed in production. How did you diagnose and resolve it under pressure?",
      hint: "Use STAR method: Situation, Task, Action, Result. Highlight rollback scripts, zero downtime deployments, and post-mortem analysis.",
    },
  ];

  // Timer Effect during Active Interview
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "active" && isRecording && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, isRecording, timeRemaining]);

  const handleStartInterview = () => {
    setStep("active");
    setCurrentQuestionIndex(0);
    setTimeRemaining(180);
    setIsRecording(true);
    setTranscript([
      "AI Interviewer: Welcome to your Nexora AI Mock Interview session. Let's begin with the first question.",
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeRemaining(180);
      setUserSpeech("");
    } else {
      setStep("results");
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="space-y-8">
      {/* Step 1: Interview Setup */}
      {step === "setup" && (
        <div className="max-w-3xl mx-auto space-y-6">
          <GlassCard className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-500 dark:bg-sky-400/10 dark:text-sky-400">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Configure Your AI Mock Interview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Customize the role, complexity, and topics before starting your voice simulation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Target Role
                </label>
                <select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option>Full Stack Engineer</option>
                  <option>Frontend Developer (React/Next.js)</option>
                  <option>Backend Engineer (Node/Python/Go)</option>
                  <option>System Architect & Technical Lead</option>
                  <option>DevOps & Cloud Engineer</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option>Entry-Level / Graduate (0-2 yrs)</option>
                  <option>Mid-Level (2-5 yrs)</option>
                  <option>Senior Engineer (5-8 yrs)</option>
                  <option>Staff / Principal Architect (8+ yrs)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Interview Type
                </label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option>Technical & System Design</option>
                  <option>Behavioral & STAR Method</option>
                  <option>HR & Cultural Fit</option>
                  <option>Comprehensive Mixed Panel</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option>15 Minutes (Express)</option>
                  <option>30 Minutes (Standard)</option>
                  <option>45 Minutes (Deep Dive)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Webcam & Mic simulation active</span>
              </div>
              <GlowButton onClick={handleStartInterview} icon={Play} size="lg">
                Start Interview Session
              </GlowButton>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Step 2: Active Interview Simulator Workspace */}
      {step === "active" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL: Question & Timer */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="sky">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
                <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-slate-900 dark:text-white">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span>{formatTimer(timeRemaining)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                  {questions[currentQuestionIndex].type} Focus
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                  {questions[currentQuestionIndex].question}
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <span className="font-bold text-sky-500">AI Strategy Hint:</span>
                <p>{questions[currentQuestionIndex].hint}</p>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setMicActive(!micActive)}
                  className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                    micActive
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/30"
                  }`}
                >
                  {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  <span>{micActive ? "Microphone On" : "Muted"}</span>
                </button>

                <GlowButton onClick={handleNextQuestion} icon={ChevronRight} size="sm">
                  {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                </GlowButton>
              </div>
            </GlassCard>
          </div>

          {/* CENTER PANEL: Video Feed & Recording Controls */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="space-y-4 text-center">
              <div className="relative aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Simulated Webcam View */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 p-1 shadow-lg shadow-sky-500/30 animate-pulse">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-extrabold text-xl">
                      YOU
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-xs font-semibold text-white backdrop-blur-md">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Live Video Feedback Active</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-bold shadow-md">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>RECORDING ANSWER</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <GlowButton
                  onClick={() => setIsRecording(!isRecording)}
                  variant={isRecording ? "danger" : "primary"}
                  icon={isRecording ? Square : Play}
                >
                  {isRecording ? "Pause Recording" : "Resume Recording"}
                </GlowButton>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT PANEL: Live Speech Transcript & Real-Time Analytics */}
          <div className="lg:col-span-3 space-y-6">
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Transcript & Metrics
                </span>
                <Volume2 className="w-4 h-4 text-sky-500 animate-pulse" />
              </div>

              <div className="h-48 overflow-y-auto space-y-2 text-xs font-mono p-3 rounded-xl bg-slate-900 text-slate-300 border border-slate-800">
                {transcript.map((line, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {line}
                  </p>
                ))}
                <p className="text-sky-400 animate-pulse">
                  [Speaking]: &quot;In my recent application deployment, I implemented Redis caching for database queries...&quot;
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Pace & Delivery</span>
                  <span className="text-emerald-500">Optimal (135 wpm)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]" />
                </div>

                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-600 dark:text-slate-400">Technical Clarity</span>
                  <span className="text-sky-500">92%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full w-[92%]" />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Step 3: Interview Scorecard & Feedback Report */}
      {step === "results" && (
        <div className="space-y-8">
          <GlassCard className="text-center space-y-4 max-w-2xl mx-auto py-8">
            <Badge variant="emerald" icon={CheckCircle2}>
              Interview Session Completed
            </Badge>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Performance Evaluation Report
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Evaluated across 5 core dimensions for <strong className="text-sky-500">{jobRole}</strong> ({experienceLevel}).
            </p>

            <div className="flex justify-center py-4">
              <ProgressRing progress={91} size={150} label="91%" sublabel="Overall Score" color="emerald" />
            </div>

            <div className="flex justify-center gap-3">
              <GlowButton onClick={() => setStep("setup")} icon={RefreshCw}>
                Try Another Interview
              </GlowButton>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Technical Depth" value="94%" change="+8%" trend="up" description="Strong architectural terminology" />
            <StatCard title="Communication Clarity" value="88%" change="+5%" trend="up" description="Structured response STAR method" />
            <StatCard title="Problem Solving" value="92%" change="+10%" trend="up" description="Optimal trade-off analysis" />
            <StatCard title="Confidence Score" value="89%" change="+4%" trend="up" description="Minimal hesitation markers" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="space-y-4">
              <h4 className="text-base font-extrabold text-emerald-500 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Key Strengths Identified
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Articulated Redis sliding-window algorithm for rate-limiting with precision.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Used clear STAR method structure when addressing production rollback scenarios.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>Effective vocabulary for Next.js Server Components and cache revalidation strategies.</span>
                </li>
              </ul>
            </GlassCard>

            <GlassCard className="space-y-4">
              <h4 className="text-base font-extrabold text-sky-500 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI Improvement Recommendations
              </h4>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>Quantify impact numbers directly in behavioral answers (e.g., &quot;reduced latency by 45%&quot;).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-500 font-bold">•</span>
                  <span>Elaborate further on database failover mechanisms during system design questions.</span>
                </li>
              </ul>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
