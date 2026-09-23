"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  githubApi,
  GitHubProfile,
  GitHubRepository,
  RepositoryAnalysis,
  ResumeAlignmentItem,
} from "@/lib/api/github";
import { GitHubConnectCard } from "./GitHubConnectCard";
import { GitHubProfileHeader } from "./GitHubProfileHeader";
import { GitHubStatsSummary } from "./GitHubStatsSummary";
import { RepositoryCard } from "./RepositoryCard";
import { RepositoryFilterBar } from "./RepositoryFilterBar";
import { ResumeAlignmentCard } from "./ResumeAlignmentCard";
import { RepositoryDetailModal } from "./RepositoryDetailModal";
import { GitHubSkeleton } from "./GitHubSkeleton";
import { AlertCircle, RefreshCw, FolderGit2, Sparkles, ShieldCheck } from "lucide-react";

export function GitHubWorkspace() {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repositories, setRepositories] = useState<GitHubRepository[]>([]);
  const [alignment, setAlignment] = useState<ResumeAlignmentItem[]>([]);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [analyzingRepoId, setAnalyzingRepoId] = useState<string | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<{
    repo: GitHubRepository;
    analysis: RepositoryAnalysis;
  } | null>(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [language, setLanguage] = useState("All");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Load profile & repositories from backend
  const loadGitHubData = async () => {
    setLoading(true);
    setErrorState(null);
    try {
      const res = await githubApi.getProfile();
      if (res.success && res.connected && res.profile) {
        setConnected(true);
        setProfile(res.profile);

        const repoRes = await githubApi.getRepositories();
        if (repoRes.success) {
          setRepositories(repoRes.repositories);
        }

        const alignRes = await githubApi.getResumeAlignment();
        if (alignRes.success) {
          setAlignment(alignRes.alignment);
        }
      } else {
        setConnected(false);
        setProfile(null);
      }
    } catch (err: any) {
      console.error("Failed to load GitHub data:", err);
      setErrorState("We couldn't load your GitHub data. GitHub API may be temporarily unavailable or rate limited.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGitHubData();
  }, []);

  // Connect Handler
  const handleConnect = async (username: string) => {
    setConnecting(true);
    setNotification(null);
    try {
      const res = await githubApi.connect(username);
      if (res.success && res.profile) {
        setConnected(true);
        setProfile(res.profile);
        setNotification({
          type: "success",
          message: `Connected @${res.profile.username} successfully!`,
        });
        await loadGitHubData();
      } else {
        setNotification({
          type: "error",
          message: (res as any).error || "Failed to connect GitHub account. Please ensure you are logged in and entering a valid GitHub handle.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.response?.data?.error || err.message || "Failed to connect GitHub account.",
      });
    } finally {
      setConnecting(false);
    }
  };

  // Disconnect Handler
  const handleDisconnect = async () => {
    try {
      await githubApi.disconnect();
      setConnected(false);
      setProfile(null);
      setRepositories([]);
      setAlignment([]);
      setNotification({ type: "info", message: "GitHub account disconnected." });
    } catch (err: any) {
      setNotification({ type: "error", message: "Failed to disconnect." });
    }
  };

  // Analyze Repository Handler (Triggered ONLY when user explicitly selects a repo)
  const handleAnalyzeRepo = async (repo: GitHubRepository) => {
    setAnalyzingRepoId(repo.id);
    setNotification({
      type: "info",
      message: `Analyzing signals for ${repo.fullName}...`,
    });

    try {
      const res = await githubApi.analyzeRepository(repo.owner, repo.name);
      if (res.success && res.analysis) {
        setSelectedAnalysis({ repo, analysis: res.analysis });
        setNotification({
          type: "success",
          message: `Analysis completed for ${repo.name}!`,
        });
        await loadGitHubData();
      } else {
        setNotification({
          type: "error",
          message: (res as any).error || "Failed to analyze repository.",
        });
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err.response?.data?.error || err.message || "Failed to analyze repository.",
      });
    } finally {
      setAnalyzingRepoId(null);
    }
  };

  const handleViewAnalysis = (repo: GitHubRepository) => {
    if (repo.analyses.length > 0) {
      handleAnalyzeRepo(repo);
    }
  };

  // Available Languages for filter
  const availableLanguages = Array.from(
    new Set(repositories.map((r) => r.primaryLanguage).filter(Boolean) as string[])
  );

  // Filtered Repositories based on Evidence Levels & Search
  const filteredRepos = repositories.filter((r) => {
    // Search text filter
    if (search.trim()) {
      const term = search.toLowerCase();
      const matchName = r.name.toLowerCase().includes(term);
      const matchDesc = r.description?.toLowerCase().includes(term);
      const matchLang = r.primaryLanguage?.toLowerCase().includes(term);
      if (!matchName && !matchDesc && !matchLang) return false;
    }

    // Language dropdown filter
    if (language !== "All" && r.primaryLanguage?.toLowerCase() !== language.toLowerCase()) {
      return false;
    }

    // Evidence Level Filters
    const isAnalyzed = r.analyses.length > 0 && r.analyses[0].status === "COMPLETED";
    const isStrong = isAnalyzed || r.stars >= 5 || r.forks >= 2;
    const isModerate = !isStrong && (r.stars > 0 || r.forks > 0);

    if (filter === "Strong Evidence") {
      return isStrong;
    }
    if (filter === "Moderate Evidence") {
      return isModerate;
    }
    if (filter === "Limited Evidence" || filter === "Insufficient Evidence") {
      return !isStrong && !isModerate;
    }
    if (filter === "Starred") {
      return r.stars > 0;
    }

    return true;
  });

  // Skeleton Loading State
  if (loading) {
    return <GitHubSkeleton />;
  }

  // Error State with Retry Button
  if (errorState) {
    return (
      <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          We couldn&apos;t load your GitHub data
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          {errorState}
        </p>
        <button
          type="button"
          onClick={loadGitHubData}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Loading Data</span>
        </button>
      </div>
    );
  }

  // Disconnected Empty State
  if (!connected || !profile) {
    return (
      <div className="space-y-6">
        {notification && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}
        <GitHubConnectCard onConnect={handleConnect} loading={connecting} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast Notification Alert */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 transition-all ${
            notification.type === "error"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300"
              : notification.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300"
              : "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-300"
          }`}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 font-bold"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Hero Header Section */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Developer Intelligence
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Turn your GitHub activity into career evidence.
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed pt-1">
          Analyze your repositories, engineering practices, and project experience using evidence from your actual GitHub profile.
        </p>
      </div>

      {/* GitHub Profile Header */}
      <GitHubProfileHeader
        profile={profile}
        onRefresh={loadGitHubData}
        onDisconnect={handleDisconnect}
        syncing={loading}
      />

      {/* Summary Stats Grid */}
      <GitHubStatsSummary
        totalRepos={profile.stats.totalRepositories}
        totalLanguages={profile.stats.totalLanguages}
        analyzedCount={profile.stats.projectsAnalyzed}
      />

      {/* Resume ↔ GitHub Skill Alignment */}
      {alignment.length > 0 && <ResumeAlignmentCard alignmentItems={alignment} />}

      {/* Repository Discovery & Filter Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
              <ShieldCheck className="w-5 h-5 text-sky-500" />
              Engineering Evidence
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Signals detected from your actual code repositories. Select a project to view or generate deep analysis.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <RepositoryFilterBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          language={language}
          setLanguage={setLanguage}
          availableLanguages={availableLanguages}
        />

        {/* Repository Grid */}
        {filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repository={repo}
                onAnalyze={handleAnalyzeRepo}
                onViewAnalysis={handleViewAnalysis}
                analyzing={analyzingRepoId === repo.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl space-y-3 shadow-sm">
            <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No repositories match your filters.
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or evidence level filter options.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Analysis Modal */}
      {selectedAnalysis && (
        <RepositoryDetailModal
          repository={selectedAnalysis.repo}
          analysis={selectedAnalysis.analysis}
          onClose={() => setSelectedAnalysis(null)}
        />
      )}
    </div>
  );
}
