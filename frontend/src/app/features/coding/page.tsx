"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import {
  Code2,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  Search,
  Filter,
  Flame,
  Target,
  Trophy,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Terminal,
  ShieldCheck,
} from "lucide-react";
import { codingApi, CodingProblemDTO, CodingStatsDTO, CodingSubmissionHistoryItem } from "@/lib/api/coding";
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
];

const LANGUAGES = ["ALL", "Java", "C++", "Python", "JavaScript", "TypeScript"];

export default function CodingArenaDashboard() {
  const { user } = useAuth();

  // State
  const [problems, setProblems] = useState<CodingProblemDTO[]>([]);
  const [stats, setStats] = useState<CodingStatsDTO | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<CodingSubmissionHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedTopic, setSelectedTopic] = useState("ALL");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProblemsCount, setTotalProblemsCount] = useState(0);

  // Fetch Stats & Submissions
  useEffect(() => {
    if (user) {
      loadStatsAndSubmissions();
    }
  }, [user]);

  const loadStatsAndSubmissions = async () => {
    setIsStatsLoading(true);
    const [statsRes, subRes] = await Promise.all([
      codingApi.getStats(),
      codingApi.getSubmissions(),
    ]);

    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }
    if (subRes.success && subRes.data) {
      setRecentSubmissions(subRes.data.slice(0, 5));
    }
    setIsStatsLoading(false);
  };

  // Fetch Problems List
  useEffect(() => {
    loadProblems();
  }, [searchTerm, selectedDifficulty, selectedTopic, selectedLanguage, selectedStatus, currentPage]);

  const loadProblems = async () => {
    setIsLoading(true);
    const res = await codingApi.listProblems({
      search: searchTerm,
      difficulty: selectedDifficulty,
      topic: selectedTopic,
      language: selectedLanguage,
      status: selectedStatus,
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

  const getDifficultyBadge = (difficulty: string) => {
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

  return (
    <FeatureLayout
      featureId="coding"
      title="Coding Arena"
      subtitle="Practice 100+ original algorithms, data structures, and competitive programming problems with instant execution feedback and Nexus AI mentorship."
      category="Technical Mastery"
      badge="100+ Problems"
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
              <span className="text-[10px] text-sky-500 font-bold">16 Topics</span>
            </span>

            <div className="space-y-1.5 text-[11px] font-medium">
              <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400">
                <span>Easy</span>
                <span>
                  {stats?.difficultyBreakdown.easy.solved ?? 0} / {stats?.difficultyBreakdown.easy.total ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-amber-600 dark:text-amber-400">
                <span>Medium</span>
                <span>
                  {stats?.difficultyBreakdown.medium.solved ?? 0} / {stats?.difficultyBreakdown.medium.total ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center text-rose-600 dark:text-rose-400">
                <span>Hard</span>
                <span>
                  {stats?.difficultyBreakdown.hard.solved ?? 0} / {stats?.difficultyBreakdown.hard.total ?? 0}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 1.5 RECOMMENDED PROBLEMS BANNER (PROGRESS-BACKED) */}
        {stats?.recommendedProblems && stats.recommendedProblems.length > 0 && (
          <GlassCard className="p-5 space-y-4 border-l-4 border-l-amber-500 bg-amber-500/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Targeted Practice: {stats.recommendedTopic}
                  </h3>
                  <Badge variant="amber">Progress Recommended</Badge>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  {stats.recommendedReason}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedTopic(stats.recommendedTopic || "ALL");
                  setCurrentPage(1);
                }}
                className="text-xs font-semibold text-sky-500 hover:underline shrink-0"
              >
                View All {stats.recommendedTopic} Problems →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {stats.recommendedProblems.map((rec) => (
                <Link
                  key={rec.id}
                  href={`/features/coding/problem/${rec.slug}`}
                  className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 transition-all space-y-2 group shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors truncate">
                      {rec.title}
                    </span>
                    {getDifficultyBadge(rec.difficulty)}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{rec.topic}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-sky-500 font-semibold">
                      Solve <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </GlassCard>
        )}

        {/* 2. TOPIC FILTERING CHIPS */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-500" />
              Explore Problem Topics
            </h3>
            <span className="text-xs text-slate-400 font-medium">{TOPICS.length - 1} Core Domains</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {TOPICS.map((topic) => {
              const isSelected = selectedTopic === topic;
              return (
                <button
                  key={topic}
                  onClick={() => {
                    setSelectedTopic(topic);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? "bg-sky-500 text-white border-sky-500 shadow-md shadow-sky-500/20"
                      : "bg-white/70 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-sky-500/40"
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. PROBLEM LIBRARY & FILTERS BAR */}
        <GlassCard className="p-6 space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Problem Library</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {totalProblemsCount} Available
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Filter by difficulty, programming language, topic domain, or completion status.
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
                  placeholder="Search problems..."
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
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
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
                <p className="text-xs">Loading problem bank...</p>
              </div>
            ) : problems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Code2 className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No matching coding problems found
                </p>
                <p className="text-xs text-slate-400">
                  Try adjusting your search query, difficulty, or topic filter.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3 w-10">Status</th>
                    <th className="py-3 px-4">Title & Source</th>
                    <th className="py-3 px-4">Topic Domain</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {problems.map((prob) => {
                    const isSolved = prob.userStatus === "SOLVED";
                    const isAttempted = prob.userStatus === "ATTEMPTED";

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

                        {/* Title & License */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <Link
                              href={`/features/coding/problem/${prob.id}`}
                              className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-sky-500 transition-colors flex items-center gap-2"
                            >
                              <span>{prob.title}</span>
                            </Link>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                                {prob.source}
                              </span>
                              <span>•</span>
                              <span>{prob.license} License</span>
                            </div>
                          </div>
                        </td>

                        {/* Topic */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-semibold text-[11px] border border-sky-500/20">
                            {prob.topic}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="py-3.5 px-4">{getDifficultyBadge(prob.difficulty)}</td>

                        {/* Action Link */}
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/features/coding/problem/${prob.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-sky-500 dark:hover:bg-sky-500 text-white font-semibold text-xs transition-colors shadow-sm"
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

        {/* 4. RECENT SUBMISSIONS DRAWER */}
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
