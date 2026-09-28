"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import {
  Code2,
  CheckCircle2,
  Clock,
  Zap,
  Search,
  Flame,
  Target,
  Trophy,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Calendar,
  Award,
  Layers,
} from "lucide-react";
import {
  codingApi,
  CodingProblemDTO,
  CodingStatsDTO,
  CodingSubmissionHistoryItem,
  CodeforcesContestDTO,
  CodeforcesDailyDTO,
} from "@/lib/api/coding";
import { useAuth } from "@/context/AuthContext";

const TOPICS = [
  "ALL",
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "Binary Tree",
  "BST",
  "Heap",
  "Hashing",
  "Graphs",
  "Recursion",
  "Backtracking",
  "Dynamic Programming",
  "Greedy",
  "Sorting",
  "Searching",
  "implementation",
  "math",
  "greedy",
  "brute force",
  "constructive algorithms",
];

const LANGUAGES = ["ALL", "Java", "C++", "Python", "JavaScript", "TypeScript"];

export default function CodingArenaDashboard() {
  const { user } = useAuth();

  // State
  const [problems, setProblems] = useState<CodingProblemDTO[]>([]);
  const [stats, setStats] = useState<CodingStatsDTO | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<CodingSubmissionHistoryItem[]>([]);
  const [dailyChallenge, setDailyChallenge] = useState<CodeforcesDailyDTO | null>(null);
  const [upcomingContests, setUpcomingContests] = useState<CodeforcesContestDTO[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Filter & Pagination State
  const [selectedSource, setSelectedSource] = useState<"ALL" | "NEXORA" | "CODEFORCES">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblemsCount, setTotalProblemsCount] = useState(0);

  // Fetch Stats, Submissions, Daily Challenge & Contests
  useEffect(() => {
    loadAuxiliaryData();
  }, [user]);

  const loadAuxiliaryData = async () => {
    setIsStatsLoading(true);

    const promises: Promise<any>[] = [
      codingApi.getCodeforcesDaily(),
      codingApi.getCodeforcesContests(),
    ];

    if (user) {
      promises.push(codingApi.getStats());
      promises.push(codingApi.getSubmissions());
    }

    const [dailyRes, contestRes, statsRes, subRes] = await Promise.all(promises);

    if (dailyRes?.success && dailyRes.data) {
      setDailyChallenge(dailyRes.data);
    }

    if (contestRes?.success && contestRes.data) {
      setUpcomingContests(contestRes.data.contests.slice(0, 4));
    }

    if (statsRes?.success && statsRes.data) {
      setStats(statsRes.data);
    }
    if (subRes?.success && subRes.data) {
      setRecentSubmissions(subRes.data.slice(0, 5));
    }
    setIsStatsLoading(false);
  };

  // Fetch Problems List
  useEffect(() => {
    loadProblems();
  }, [searchTerm, selectedDifficulty, selectedTopic, selectedLanguage, selectedStatus, selectedSource, currentPage]);

  const loadProblems = async () => {
    setIsLoading(true);
    const res = await codingApi.listProblems({
      search: searchTerm,
      difficulty: selectedDifficulty,
      topic: selectedTopic,
      language: selectedLanguage,
      status: selectedStatus,
      source: selectedSource,
      page: currentPage,
      limit: 15,
    });

    if (res.success && res.data) {
      setProblems(res.data.problems);
      setTotalPages(res.data.totalPages);
      setTotalProblemsCount(res.data.total);
    }
    setIsLoading(false);
  };

  const getDifficultyBadge = (difficulty: string, rating?: number | null) => {
    if (rating) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
          CF {rating}
        </span>
      );
    }

    switch (difficulty.toUpperCase()) {
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

  const formatCountdown = (startTimeSeconds?: number | null) => {
    if (!startTimeSeconds) return "TBD";
    const nowSec = Math.floor(Date.now() / 1000);
    const diffSec = startTimeSeconds - nowSec;
    if (diffSec <= 0) return "Started / Live";

    const hours = Math.floor(diffSec / 3600);
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;

    if (days > 0) return `in ${days}d ${remHours}h`;
    return `in ${hours}h`;
  };

  return (
    <FeatureLayout
      featureId="coding"
      title="Coding Arena"
      subtitle="Practice original algorithms and official Codeforces competitive programming problems with sandboxed code execution, stable daily challenges, and live contest tracking."
      category="Technical Mastery"
      badge="Codeforces Powered"
    >
      <div className="space-y-8">
        {/* 1. STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Solved Progress */}
          <GlassCard className="p-5 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Problems Solved
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats?.totalSolved ?? 0}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  / {stats?.totalProblems ?? totalProblemsCount}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
          </GlassCard>

          {/* Card 2: Accuracy Rate */}
          <GlassCard className="p-5 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-sky-500" />
                Submission Accuracy
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats?.accuracy ?? 0}%
                </span>
                <span className="text-xs text-slate-500 font-medium">acceptance</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
          </GlassCard>

          {/* Card 3: Active Streak */}
          <GlassCard className="p-5 flex items-center justify-between relative overflow-hidden">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                Coding Streak
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {stats?.currentStreak ?? 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">days active</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6" />
            </div>
          </GlassCard>

          {/* Card 4: Difficulty Distribution */}
          <GlassCard className="p-5 space-y-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Difficulty Progress</span>
              <span className="text-[10px] text-purple-400 font-bold">CF Integration Active</span>
            </span>

            <div className="space-y-1.5 text-[11px] font-medium">
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>Easy (&lt; 1200)</span>
                <span>
                  {stats?.difficultyBreakdown.easy.solved ?? 0} / {stats?.difficultyBreakdown.easy.total ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
                <span>Medium (1200-1600)</span>
                <span>
                  {stats?.difficultyBreakdown.medium.solved ?? 0} / {stats?.difficultyBreakdown.medium.total ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
                <span>Hard (&gt; 1600)</span>
                <span>
                  {stats?.difficultyBreakdown.hard.solved ?? 0} / {stats?.difficultyBreakdown.hard.total ?? 0}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 2. DAILY CHALLENGE & UPCOMING CONTESTS DUAL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* DAILY CHALLENGE CARD */}
          <GlassCard className="lg:col-span-7 p-6 border-l-4 border-l-cyan-500 bg-cyan-500/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Codeforces Daily Challenge
                  </h3>
                  <Badge variant="cyan">Date Stable</Badge>
                </div>
                {dailyChallenge && (
                  <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    {dailyChallenge.date}
                  </span>
                )}
              </div>

              {dailyChallenge ? (
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-400 font-mono">
                        Contest {dailyChallenge.problem.contestId} — Problem {dailyChallenge.problem.index}
                      </span>
                      <h4 className="text-lg font-extrabold text-white mt-0.5">
                        {dailyChallenge.problem.name}
                      </h4>
                    </div>
                    {dailyChallenge.problem.rating && (
                      <span className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/30">
                        CF {dailyChallenge.problem.rating}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dailyChallenge.problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {dailyChallenge.problem.solvedCount !== undefined && (
                    <p className="text-[11px] text-slate-400">
                      Accepted Solved Count: <span className="text-cyan-400 font-semibold">{dailyChallenge.problem.solvedCount?.toLocaleString()}</span> candidates
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 italic">
                  Loading Today&apos;s Daily Challenge...
                </div>
              )}
            </div>

            {dailyChallenge && (
              <div className="pt-2 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {dailyChallenge.isPersonalized ? "Personalized difficulty based on date" : "Global deterministic selection for today"}
                </span>
                <Link
                  href={`/features/coding/problem/${dailyChallenge.problem.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>Solve Daily Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </GlassCard>

          {/* UPCOMING CONTESTS CARD */}
          <GlassCard className="lg:col-span-5 p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Upcoming Codeforces Contests</span>
                </h3>
                <Badge variant="purple">Live API</Badge>
              </div>

              <div className="space-y-2.5 pt-3">
                {upcomingContests.length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Fetching upcoming Codeforces events...
                  </p>
                ) : (
                  upcomingContests.map((c) => (
                    <div
                      key={c.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs space-y-1"
                    >
                      <div className="pr-2 space-y-0.5">
                        <span className="font-bold text-slate-200 line-clamp-1">{c.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>Starts: {formatCountdown(c.startTimeSeconds)}</span>
                          <span>•</span>
                          <span>Duration: {Math.round(c.durationSeconds / 3600)}h</span>
                        </div>
                      </div>

                      <a
                        href={c.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-200 hover:text-white transition-colors text-[11px] font-semibold flex items-center gap-1 shrink-0"
                      >
                        <span>Contest</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 text-right">
              Official contest scheduling from Codeforces API
            </div>
          </GlassCard>
        </div>

        {/* 3. SOURCE TABS & TOPIC CHIPS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* SOURCE SELECTOR TABS */}
            <div className="flex items-center p-1 rounded-2xl bg-slate-900 border border-slate-800">
              <button
                onClick={() => {
                  setSelectedSource("ALL");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSource === "ALL"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Sources
              </button>

              <button
                onClick={() => {
                  setSelectedSource("NEXORA");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedSource === "NEXORA"
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Nexora Executable
              </button>

              <button
                onClick={() => {
                  setSelectedSource("CODEFORCES");
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedSource === "CODEFORCES"
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-cyan-300" />
                <span>Codeforces Official</span>
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar max-w-full">
              {TOPICS.slice(0, 10).map((topic) => {
                const isSelected = selectedTopic === topic;
                return (
                  <button
                    key={topic}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setCurrentPage(1);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                      isSelected
                        ? "bg-sky-500 text-white border-sky-500 shadow-md"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {topic}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. PROBLEM LIBRARY & FILTERS BAR */}
        <GlassCard className="p-6 space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Problem Library</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {totalProblemsCount} {selectedSource === "CODEFORCES" ? "Codeforces Problems" : "Available"}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedSource === "CODEFORCES"
                  ? "Codeforces official problems with live rating & solved count metadata. Solve directly on Codeforces."
                  : "Filter by difficulty, programming language, topic domain, or completion status."}
              </p>
            </div>

            {/* Filter Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search problems or tags..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              {/* Difficulty */}
              <select
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="ALL">Difficulty: All</option>
                <option value="EASY">Easy (&lt; 1200)</option>
                <option value="MEDIUM">Medium (1200-1600)</option>
                <option value="HARD">Hard (&gt; 1600)</option>
              </select>

              {/* Language */}
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    Language: {l}
                  </option>
                ))}
              </select>

              {/* Status */}
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="ALL">Status: All</option>
                <option value="SOLVED">Solved</option>
                <option value="ATTEMPTED">Attempted</option>
                <option value="NOT_STARTED">Not Started</option>
              </select>
            </div>
          </div>

          {/* Problems Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin text-sky-500 mx-auto" />
                <p className="text-xs">Loading problems from {selectedSource === "CODEFORCES" ? "Codeforces API" : "database"}...</p>
              </div>
            ) : problems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Code2 className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No matching coding problems found
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query, difficulty, or source filter.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3 w-10">Status</th>
                    <th className="py-3 px-4">Title & Details</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">Topic / Tags</th>
                    <th className="py-3 px-4">Rating / Difficulty</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {problems.map((prob) => {
                    const isSolved = prob.userStatus === "SOLVED";
                    const isAttempted = prob.userStatus === "ATTEMPTED";
                    const isCodeforces = prob.source === "CODEFORCES" || !!prob.officialUrl;

                    return (
                      <tr
                        key={prob.id}
                        className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Status Icon */}
                        <td className="py-3.5 px-3">
                          {isSolved ? (
                            <span title="Solved">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </span>
                          ) : isAttempted ? (
                            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" title="Attempted" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700" title="Not Started" />
                          )}
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <Link
                              href={`/features/coding/problem/${prob.id}`}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-sky-500 transition-colors flex items-center gap-1.5"
                            >
                              <span>{prob.title}</span>
                            </Link>

                            {prob.solvedCount !== undefined && prob.solvedCount !== null && (
                              <p className="text-[10px] text-slate-400">
                                {prob.solvedCount.toLocaleString()} solves on Codeforces
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Source Badge */}
                        <td className="py-3.5 px-4">
                          {isCodeforces ? (
                            <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold text-[10px]">
                              Codeforces
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-bold text-[10px]">
                              Nexora Native
                            </span>
                          )}
                        </td>

                        {/* Topic / Tags */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold text-[11px] border border-sky-500/20">
                              {prob.topic}
                            </span>
                            {prob.tags?.slice(0, 2).map((t) => (
                              <span key={t} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                                #{t}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Rating / Difficulty */}
                        <td className="py-3.5 px-4">{getDifficultyBadge(prob.difficulty, prob.rating)}</td>

                        {/* Action Link */}
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/features/coding/problem/${prob.id}`}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-semibold text-xs transition-colors shadow-sm ${
                              isCodeforces
                                ? "bg-purple-600 hover:bg-purple-500"
                                : "bg-slate-900 dark:bg-slate-800 hover:bg-sky-500 dark:hover:bg-sky-500"
                            }`}
                          >
                            <span>Solve</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4 text-xs font-semibold text-slate-500">
              <span>
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 transition-colors flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </GlassCard>

        {/* 5. RECENT SUBMISSIONS DRAWER */}
        {recentSubmissions.length > 0 && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-500" />
                Your Recent Submissions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentSubmissions.map((sub) => {
                const isAccepted = sub.status === "ACCEPTED";
                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white truncate pr-2">
                        {sub.problem?.title || "Problem"}
                      </span>
                      {isAccepted ? (
                        <Badge variant="emerald">Accepted</Badge>
                      ) : (
                        <Badge variant="rose">{sub.status}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="uppercase font-semibold text-sky-500">{sub.language}</span>
                      <span>
                        {sub.testsPassed} / {sub.totalTests} tests passed
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>
    </FeatureLayout>
  );
}
