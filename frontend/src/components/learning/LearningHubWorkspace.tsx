"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Search,
  Clock,
  ExternalLink,
  CheckCircle2,
  Tag,
  Loader2,
} from "lucide-react";
import { learningApi, LearningTopic } from "@/lib/api/learning";

export function LearningHubWorkspace() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchTopics = async () => {
    setLoading(true);
    const res = await learningApi.getTopics();
    if (res.success && res.topics) {
      setTopics(res.topics);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleToggleComplete = async (topicId: string, currentCompleted: boolean) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, isCompleted: !currentCompleted } : t))
    );
    await learningApi.toggleProgress(topicId, !currentCompleted);
  };

  const categories = ["All", ...Array.from(new Set(topics.map((t) => t.category)))];

  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Search & Filter Header Banner */}
      <GlassCard className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Curated Career Learning Hub
              </h3>
              <p className="text-xs text-slate-500">
                Handpicked DSA patterns, system design cheat sheets, and interview guides.
              </p>
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? "bg-sky-500 text-white shadow-md"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Grid of Resource Cards */}
      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium text-slate-400">Loading curated resources...</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-12">No learning resources found matching your filter.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((res) => (
            <GlassCard key={res.id} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={res.isCompleted ? "emerald" : "sky"}>
                    {res.resourceType}
                  </Badge>
                  <button
                    onClick={() => handleToggleComplete(res.id, res.isCompleted)}
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

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {res.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {res.estimatedMinutes} mins
                  </span>
                  <span className="flex items-center gap-1 font-semibold text-sky-500">
                    <Tag className="w-3.5 h-3.5" />
                    {res.category}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <a href={res.url} target="_blank" rel="noopener noreferrer">
                  <GlowButton size="sm" fullWidth icon={ExternalLink}>
                    Open Free Resource
                  </GlowButton>
                </a>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
