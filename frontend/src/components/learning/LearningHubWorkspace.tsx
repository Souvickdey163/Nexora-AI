"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  Video,
  FileText,
  Code2,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Tag,
} from "lucide-react";

interface Resource {
  id: string;
  title: string;
  category: string;
  type: "Article" | "Video" | "Course" | "Cheat Sheet" | "Interview Guide";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  progress: number; // 0 - 100
  bookmarked: boolean;
}

const RESOURCES: Resource[] = [
  {
    id: "r1",
    title: "System Design Cheat Sheet: Rate Limiters & Token Buckets",
    category: "System Design",
    type: "Cheat Sheet",
    difficulty: "Intermediate",
    duration: "15 mins",
    progress: 100,
    bookmarked: true,
  },
  {
    id: "r2",
    title: "Top 20 Data Structure Patterns for Tech Interviews",
    category: "DSA",
    type: "Interview Guide",
    difficulty: "Intermediate",
    duration: "45 mins",
    progress: 60,
    bookmarked: true,
  },
  {
    id: "r3",
    title: "Next.js 15 Server Components & Concurrency Deep Dive",
    category: "Development",
    type: "Article",
    difficulty: "Advanced",
    duration: "25 mins",
    progress: 0,
    bookmarked: false,
  },
  {
    id: "r4",
    title: "STAR Behavioral Interview Method Masterclass",
    category: "Interview Preparation",
    type: "Video",
    difficulty: "Beginner",
    duration: "30 mins",
    progress: 20,
    bookmarked: false,
  },
];

export function LearningHubWorkspace() {
  const [resources, setResources] = useState<Resource[]>(RESOURCES);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleBookmark = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, bookmarked: !r.bookmarked } : r))
    );
  };

  const filteredResources = resources.filter((r) => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || r.category === selectedCategory;
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
          {["All", "System Design", "DSA", "Development", "Interview Preparation"].map((cat) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res) => (
          <GlassCard key={res.id} className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={res.type === "Cheat Sheet" ? "amber" : "sky"}>
                  {res.type}
                </Badge>
                <button
                  onClick={() => toggleBookmark(res.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    res.bookmarked
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>

              <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {res.title}
              </h4>

              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {res.duration}
                </span>
                <span className="flex items-center gap-1 font-semibold text-sky-500">
                  <Tag className="w-3.5 h-3.5" />
                  {res.category}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                  <span>Progress</span>
                  <span>{res.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: `${res.progress}%` }} className="bg-sky-500 h-full" />
                </div>
              </div>

              <GlowButton size="sm" fullWidth icon={ExternalLink}>
                {res.progress > 0 ? "Continue Learning" : "Start Resource"}
              </GlowButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
