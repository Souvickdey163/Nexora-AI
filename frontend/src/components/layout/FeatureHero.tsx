"use client";

import React from "react";
import {
  Sparkles,
  FileText,
  CheckCircle2,
  ArrowRight,
  Code2,
  GitBranch,
  Brain,
  Award,
  BarChart3,
  BookOpen,
  MapPin,
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Zap,
} from "lucide-react";

export interface FeatureHeroConfig {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  checkmarks: string[];
  cardData: {
    icon: any;
    title: string;
    subtitle: string;
    score: string;
    scoreLabel?: string;
    scoreVariant?: "emerald" | "sky" | "amber";
    tags: string[];
    calloutTitle: string;
    calloutValue: string;
  };
}

const FEATURE_HERO_CONFIGS: Record<string, FeatureHeroConfig> = {
  "github-intelligence": {
    badge: "AI-Powered Repository & Skills Intelligence",
    titlePrefix: "GitHub ",
    titleHighlight: "Intelligence",
    subtitle: "Turn your code repositories into verified engineering proof.",
    description:
      "Analyze your real-world development projects, technical skills evidence, engineering practice signals, test coverage, and code quality directly via GitHub API.",
    primaryCtaText: "Analyze GitHub Profile",
    secondaryCtaText: "Explore Repository Signals",
    checkmarks: [
      "Real-Time GitHub API Sync",
      "Code Quality & Test Signals",
      "Portfolio Benchmark",
    ],
    cardData: {
      icon: GitBranch,
      title: "GitHub Developer Profile",
      subtitle: "Verified Engineering Signals",
      score: "94",
      scoreLabel: "/100",
      scoreVariant: "emerald",
      tags: ["TypeScript", "Python", "Docker", "+18 Signals"],
      calloutTitle: "Repository Quality Health",
      calloutValue: "Passed 18 Code Checks",
    },
  },
  "mock-interview": {
    badge: "Live AI Voice & Role Simulator",
    titlePrefix: "AI Mock ",
    titleHighlight: "Interview Studio",
    subtitle: "Master technical, behavioral, and system design interviews.",
    description:
      "Practice role-specific mock interviews with real-time Speech-to-Text, webcam presentation HUD analysis, STAR method rubrics, and instant performance reports.",
    primaryCtaText: "Start Mock Interview",
    secondaryCtaText: "View Session History",
    checkmarks: [
      "Real-Time Speech Recognition",
      "Presentation Signal HUD",
      "5-Dimension Scoring Rubric",
    ],
    cardData: {
      icon: Brain,
      title: "Candidate Live Session",
      subtitle: "Frontend & Systems Track",
      score: "85",
      scoreLabel: "/100",
      scoreVariant: "emerald",
      tags: ["STAR Rubric: 82%", "Speech: 135 WPM", "Posture: Upright"],
      calloutTitle: "Presentation HUD Status",
      calloutValue: "Active Integrity Audit",
    },
  },
  "coding-arena": {
    badge: "Algorithmic Problem Solving & Execution",
    titlePrefix: "Coding ",
    titleHighlight: "Arena",
    subtitle: "Conquer Data Structures & Algorithms with real-time code evaluation.",
    description:
      "Solve curated DSA problems in Python, JavaScript, TypeScript, C++, and Java with multi-testcase evaluation, execution time benchmarking, and instant Nexus AI code review.",
    primaryCtaText: "Solve Challenges",
    secondaryCtaText: "View Problem List",
    checkmarks: [
      "Multi-Language Execution",
      "Real-time Testcase Runner",
      "Nexus AI Code Review",
    ],
    cardData: {
      icon: Code2,
      title: "Binary Tree Path Sum",
      subtitle: "Hard • Algorithmic Challenge",
      score: "100%",
      scoreVariant: "emerald",
      tags: ["Python 3.11", "42ms Execution", "Top 94% Efficiency"],
      calloutTitle: "Testcase Verification",
      calloutValue: "Passed 15/15 Testcases",
    },
  },
  "career-roadmap": {
    badge: "Adaptive Career Pathways & Milestones",
    titlePrefix: "Personalized ",
    titleHighlight: "Career Roadmap",
    subtitle: "Build your targeted step-by-step tech career trajectory.",
    description:
      "Generate an AI-driven, multi-stage roadmap tailored to your experience level, target role, skill gaps, and weekly study schedule.",
    primaryCtaText: "Generate My Roadmap",
    secondaryCtaText: "View Active Milestones",
    checkmarks: [
      "Adaptive Skill Gap Analysis",
      "Weekly Milestone Planner",
      "Real-time Progress Tracking",
    ],
    cardData: {
      icon: MapPin,
      title: "Full-Stack Senior Architect",
      subtitle: "Stage 3 of 5 Active",
      score: "65%",
      scoreVariant: "sky",
      tags: ["Distributed Systems", "Redis Caching", "Event Loops"],
      calloutTitle: "Weekly Study Velocity",
      calloutValue: "On Track (4 hrs/week)",
    },
  },
  "skill-assessment": {
    badge: "Computer Science Proficiency Benchmark",
    titlePrefix: "Diagnostic ",
    titleHighlight: "Skill Assessment",
    subtitle: "Evaluate your core Computer Science domain mastery.",
    description:
      "Test your knowledge in DBMS, Data Structures, Operating Systems, Computer Networks, and System Design with dynamic AI-generated MCQs and domain skill reports.",
    primaryCtaText: "Begin Assessment",
    secondaryCtaText: "View Benchmark History",
    checkmarks: [
      "Dynamic Gemini MCQs",
      "Proctored Fullscreen Integrity",
      "Domain Proficiency Matrix",
    ],
    cardData: {
      icon: Award,
      title: "DBMS & Systems Benchmark",
      subtitle: "Intermediate Skill Matrix",
      score: "92%",
      scoreVariant: "emerald",
      tags: ["ACID Isolation", "Indexing", "Query Plan"],
      calloutTitle: "Proctoring Integrity",
      calloutValue: "Passed Fullscreen Audit",
    },
  },
  "placement-intelligence": {
    badge: "Placement & Target Role Match Index",
    titlePrefix: "Placement ",
    titleHighlight: "Intelligence",
    subtitle: "Calculate your exact target company readiness index.",
    description:
      "Get explainable readiness scores for Top Product Tech Companies, Tier-1 Tech Startups, and Global IT Services based on your resume, coding stats, and mock interview performance.",
    primaryCtaText: "Check Readiness Index",
    secondaryCtaText: "Compare Target Roles",
    checkmarks: [
      "Company Tier Benchmarking",
      "Actionable Gap Breakdown",
      "Placement Score Matrix",
    ],
    cardData: {
      icon: TrendingUp,
      title: "Tier-1 Product Tech Track",
      subtitle: "Target: Senior Engineer",
      score: "88%",
      scoreVariant: "emerald",
      tags: ["ATS Resume: 88", "DSA Solved: 120", "Interview: 85%"],
      calloutTitle: "Target Match Status",
      calloutValue: "Strong Candidate Match",
    },
  },
  "career-analytics": {
    badge: "Unified Performance Metrics & Insights",
    titlePrefix: "Career ",
    titleHighlight: "Analytics",
    subtitle: "Track your multi-dimension software engineering growth.",
    description:
      "A single unified dashboard consolidating your ATS resume scores, DSA problem solving velocity, mock interview trends, skill assessments, and weekly activity.",
    primaryCtaText: "View Growth Analytics",
    secondaryCtaText: "Export Summary",
    checkmarks: [
      "Consolidated Career Radar",
      "Weekly Growth Velocity",
      "Multi-Dimension Scoring",
    ],
    cardData: {
      icon: BarChart3,
      title: "Engineering Growth Radar",
      subtitle: "Weekly Performance Synthesis",
      score: "90",
      scoreLabel: "/100",
      scoreVariant: "emerald",
      tags: ["ATS Score: 88", "Coding: +14/wk", "Interview: 85%"],
      calloutTitle: "Career Growth Pace",
      calloutValue: "Top 5% Weekly Velocity",
    },
  },
  "learning-hub": {
    badge: "Structured CS Knowledge Base",
    titlePrefix: "Learning ",
    titleHighlight: "Hub",
    subtitle: "Master core computer science fundamentals and interview topics.",
    description:
      "Access curated, structured learning modules for DBMS, Concurrency, System Design, Networking, and Data Structures complete with interactive explanations and bookmarks.",
    primaryCtaText: "Explore CS Topics",
    secondaryCtaText: "Continue Learning",
    checkmarks: [
      "Curated CS Curriculum",
      "Progress Tracking",
      "Interactive Code Snippets",
    ],
    cardData: {
      icon: BookOpen,
      title: "Database Isolation Levels",
      subtitle: "DBMS & SQL Core Module",
      score: "18/24",
      scoreVariant: "sky",
      tags: ["Read Committed", "Repeatable Read", "Serializable"],
      calloutTitle: "Module Completion",
      calloutValue: "75% Progress Complete",
    },
  },
  "nexus-ai-mentor": {
    badge: "24/7 AI Career Copilot & Advisor",
    titlePrefix: "Nexus AI ",
    titleHighlight: "Career Copilot",
    subtitle: "Your personal 24/7 AI guide for technical growth & strategy.",
    description:
      "Ask anything about Data Structures, System Design, interview strategy, salary negotiations, code debugging, and career transitions with 100% free unlimited AI guidance.",
    primaryCtaText: "Chat with Nexus AI",
    secondaryCtaText: "Explore Prompts",
    checkmarks: [
      "100% Credit-Free",
      "Powered by Google Gemini",
      "Personalized Career Context",
    ],
    cardData: {
      icon: MessageSquare,
      title: "Nexus AI Copilot",
      subtitle: "Active Assistant Session",
      score: "100% FREE",
      scoreVariant: "emerald",
      tags: ["Gemini 2.5 Flash", "Markdown Output", "Context Aware"],
      calloutTitle: "Assistant Status",
      calloutValue: "Ready to Guide You",
    },
  },
};

interface FeatureHeroProps {
  featureId: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}

export function FeatureHero({
  featureId,
  title,
  subtitle,
  badge,
  onPrimaryClick,
  onSecondaryClick,
}: FeatureHeroProps) {
  // Normalize featureId (mapping alias routes like github, coding, etc.)
  const normalizedId =
    featureId === "github"
      ? "github-intelligence"
      : featureId === "interview"
      ? "mock-interview"
      : featureId === "coding"
      ? "coding-arena"
      : featureId === "roadmap"
      ? "career-roadmap"
      : featureId === "assessment"
      ? "skill-assessment"
      : featureId === "placement"
      ? "placement-intelligence"
      : featureId === "analytics"
      ? "career-analytics"
      : featureId === "learning"
      ? "learning-hub"
      : featureId === "mentor"
      ? "nexus-ai-mentor"
      : featureId;

  const defaultConfig = FEATURE_HERO_CONFIGS[normalizedId] || {
    badge: badge || "AI-Powered Career Intelligence",
    titlePrefix: (title || "Feature").split(" ")[0] + " ",
    titleHighlight: (title || "Intelligence").split(" ").slice(1).join(" ") || "Intelligence",
    subtitle: subtitle || "Supercharge your software engineering trajectory.",
    description:
      "Leverage real-time AI tools, ATS benchmarks, DSA problem solving, and interview practice designed for modern software engineers.",
    primaryCtaText: "Get Started",
    secondaryCtaText: "Learn More",
    checkmarks: ["Production-Ready AI", "Real-Time Benchmarking", "Secure & Private"],
    cardData: {
      icon: Zap,
      title: title || "Feature Intelligence",
      subtitle: "Nexora Career Copilot",
      score: "92%",
      scoreVariant: "emerald" as const,
      tags: ["AI Powered", "Real-time", "Verified"],
      calloutTitle: "Feature Health",
      calloutValue: "System Ready",
    },
  };

  const CardIcon = defaultConfig.cardData.icon;

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      // Smooth scroll to main workspace container
      const workspace = document.querySelector("#feature-workspace-content") || document.querySelector("main");
      if (workspace) {
        workspace.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else {
      window.scrollTo({ top: 450, behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-1 pb-10 md:pt-2 md:pb-12 overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 mb-8">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-cyan-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold tracking-wide backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>{defaultConfig.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {defaultConfig.titlePrefix}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                {defaultConfig.titleHighlight}
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              {defaultConfig.subtitle}
            </p>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              {defaultConfig.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handlePrimaryClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-sm shadow-xl shadow-sky-500/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 focus:outline-none"
              >
                <span>{defaultConfig.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-sky-400 dark:text-sky-600" />
              </button>

              {defaultConfig.secondaryCtaText && (
                <button
                  onClick={handleSecondaryClick}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200/80 dark:border-slate-800 transition-all duration-200 focus:outline-none"
                >
                  <span>{defaultConfig.secondaryCtaText}</span>
                </button>
              )}
            </div>

            {/* Key Value Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
              {defaultConfig.checkmarks.map((check, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  {check}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column 3D Glass Preview Mockup Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Floating 3D Glass Card */}
              <div className="relative rounded-2xl p-6 bg-white/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-sky-500/30 shadow-2xl shadow-sky-500/10 backdrop-blur-xl transform rotate-1 hover:rotate-0 transition-transform duration-500 space-y-4">
                {/* Header inside card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                      <CardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {defaultConfig.cardData.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {defaultConfig.cardData.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Floating Score Badge */}
                  <div
                    className={`px-3 py-1.5 rounded-xl border font-extrabold text-sm shadow-sm flex items-center gap-0.5 ${
                      defaultConfig.cardData.scoreVariant === "sky"
                        ? "bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30"
                        : "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    <span>{defaultConfig.cardData.score}</span>
                    {defaultConfig.cardData.scoreLabel && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        {defaultConfig.cardData.scoreLabel}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Simulation Lines */}
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/60 rounded-full" />
                  <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded-full" />
                </div>

                {/* Tags visual */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {defaultConfig.cardData.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Sub Card Callout */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    {defaultConfig.cardData.calloutTitle}
                  </span>
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {defaultConfig.cardData.calloutValue}
                  </span>
                </div>
              </div>

              {/* Decorative Secondary Backdrop Card */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/20 -z-10 blur-[1px] transform rotate-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
