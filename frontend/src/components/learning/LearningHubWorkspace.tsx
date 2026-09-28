"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Search,
  ExternalLink,
  CheckCircle2,
  Tag,
  Loader2,
  Sparkles,
  RefreshCw,
  Award,
  Layers,
  Target,
  Zap,
} from "lucide-react";
import { learningApi, LearningResource } from "@/lib/api/learning";

export function LearningHubWorkspace() {
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [recommendedForGaps, setRecommendedForGaps] = useState<LearningResource[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const fetchResources = async () => {
    setLoading(true);
    const res = await learningApi.getResources();
    if (res.success && res.resources) {
      setResources(res.resources);
      setRecommendedForGaps(res.recommendedForGaps || []);
      setMissingSkills(res.missingSkills || []);
      setTargetRole(res.targetRole || null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    await learningApi.syncResources("freeCodeCamp");
    await fetchResources();
    setSyncing(false);
  };

  const handleToggleComplete = async (resourceId: string, currentCompleted: boolean) => {
    // Optimistic UI update
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isCompleted: !currentCompleted } : r))
    );
    setRecommendedForGaps((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, isCompleted: !currentCompleted } : r))
    );

    await learningApi.toggleResourceProgress(resourceId, !currentCompleted);
  };

  // Derive filter categories & providers dynamically
  const providers = ["All", ...Array.from(new Set(resources.map((r) => r.provider)))];
  const categories = ["All", ...Array.from(new Set(resources.map((r) => r.category)))];
  const resourceTypes = ["All", "course", "module", "lesson", "project"];
  const difficulties = ["All", "beginner", "intermediate", "advanced"];

  const filteredResources = resources.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      r.category.toLowerCase().includes(q) ||
      r.skills.some((s) => s.toLowerCase().includes(q));

    const matchesProvider = selectedProvider === "All" || r.provider === selectedProvider;
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
    const matchesType = selectedType === "All" || r.resourceType === selectedType;
    const matchesDifficulty = selectedDifficulty === "All" || r.difficulty === selectedDifficulty;

    return matchesSearch && matchesProvider && matchesCategory && matchesType && matchesDifficulty;
  });

  const getDifficultyBadgeVariant = (diff?: string) => {
    switch (diff) {
      case "beginner":
        return "emerald";
      case "intermediate":
        return "amber";
      case "advanced":
        return "rose";
      default:
        return "sky";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Controls Banner */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Curated Career Learning Hub
                <Badge variant="purple" size="sm">
                  freeCodeCamp Integrated
                </Badge>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore real curriculum courses, modules, and projects synchronized directly from freeCodeCamp.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses, skills..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <GlowButton
              size="sm"
              variant="outline"
              onClick={handleSync}
              disabled={syncing}
              icon={syncing ? Loader2 : RefreshCw}
            >
              {syncing ? "Syncing..." : "Sync freeCodeCamp"}
            </GlowButton>
          </div>
        </div>

        {/* Multi-tier Filtering */}
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">Type:</span>
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors capitalize ${
                    selectedType === type
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-400">Difficulty:</span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors capitalize ${
                    selectedDifficulty === diff
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* PHASE 7: Recommended for Your Skill Gaps Section */}
      {recommendedForGaps.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  Recommended for Your Skill Gaps
                  <Badge variant="amber" size="sm">
                    Priority Match
                  </Badge>
                </h4>
                <p className="text-xs text-slate-500">
                  {targetRole ? `Aligned with your target role: ${targetRole}` : "Personalized learning recommendations based on your resume & roadmap gaps."}
                </p>
              </div>
            </div>
          </div>

          {/* Missing Skill Chips */}
          {missingSkills.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 bg-amber-500/5 dark:bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Target className="w-3.5 h-3.5" /> Your Skill Gaps:
              </span>
              {missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 capitalize"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Grid of Recommended Priority Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedForGaps.map((res) => (
              <GlassCard
                key={`rec-${res.id}`}
                className="space-y-4 flex flex-col justify-between border-2 border-amber-500/30 hover:border-amber-500/60 transition-all shadow-lg shadow-amber-500/5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="amber" size="sm">
                        <Zap className="w-3 h-3 mr-1" />
                        Skill Match: {res.matchedMissingSkills?.[0] || "Gap"}
                      </Badge>
                      <Badge variant={getDifficultyBadgeVariant(res.difficulty)} size="sm">
                        {res.difficulty || "intermediate"}
                      </Badge>
                      <Badge variant="purple" size="sm">
                        {res.provider}
                      </Badge>
                    </div>

                    <button
                      onClick={() => handleToggleComplete(res.id, !!res.isCompleted)}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        res.isCompleted
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {res.isCompleted ? "Completed" : "Mark Done"}
                    </button>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {res.title}
                  </h4>

                  {res.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {res.description}
                    </p>
                  )}

                  {/* Skill Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-medium capitalize flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-sky-500" />
                    {res.category} ({res.resourceType})
                  </span>

                  <a href={res.url} target="_blank" rel="noopener noreferrer">
                    <GlowButton size="sm" icon={ExternalLink}>
                      Open Free Resource
                    </GlowButton>
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Main Learning Resources Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-500" />
            All Curriculum Resources ({filteredResources.length})
          </h4>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">Loading freeCodeCamp resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <GlassCard className="text-center py-16 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No learning resources found matching your filter criteria.
            </p>
            <p className="text-xs text-slate-500">
              Try adjusting your search query, difficulty, or category tab.
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredResources.map((res) => (
              <GlassCard key={res.id} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={res.isCompleted ? "emerald" : "sky"} size="sm">
                        {res.resourceType}
                      </Badge>
                      <Badge variant={getDifficultyBadgeVariant(res.difficulty)} size="sm">
                        {res.difficulty || "intermediate"}
                      </Badge>
                      <Badge variant="purple" size="sm">
                        {res.provider}
                      </Badge>
                    </div>

                    <button
                      onClick={() => handleToggleComplete(res.id, !!res.isCompleted)}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        res.isCompleted
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {res.isCompleted ? "Completed" : "Mark Done"}
                    </button>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                    {res.title}
                  </h4>

                  {res.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {res.description}
                    </p>
                  )}

                  {/* Skills Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {res.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-sky-500" />
                    {res.category}
                  </span>

                  <a href={res.url} target="_blank" rel="noopener noreferrer">
                    <GlowButton size="sm" icon={ExternalLink}>
                      Open Free Resource
                    </GlowButton>
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
