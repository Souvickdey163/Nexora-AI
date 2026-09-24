"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import {
  Compass,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Sparkles,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { roadmapApi } from "@/lib/api/roadmap";
import { useAuth } from "@/context/AuthContext";

interface Milestone {
  id: string;
  stage: string;
  title: string;
  description: string;
  difficulty?: string;
  estimatedTime?: string;
  completed: boolean;
  resourceCount?: number;
}

export function PersonalizedRoadmapWorkspace() {
  const { refreshUser } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [targetRole, setTargetRole] = useState("Full-Stack Software Engineer");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setLoading(true);
    setError(null);
    const res = await roadmapApi.getActiveRoadmap();
    if (res.success && res.roadmap) {
      setTargetRole(res.roadmap.targetRole || "Full-Stack Software Engineer");
      setMilestones(
        res.roadmap.milestones?.map((m: any) => ({
          id: m.id,
          stage: m.stage || "Stage",
          title: m.title,
          description: m.description,
          difficulty: m.difficulty || "Intermediate",
          estimatedTime: m.estimatedTime || "1 Week",
          completed: m.isCompleted ?? m.completed ?? false,
          resourceCount: m.resources ? JSON.parse(typeof m.resources === 'string' ? m.resources : JSON.stringify(m.resources)).length : 4,
        })) || []
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const toggleComplete = async (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
    await roadmapApi.toggleMilestone(id);
    await refreshUser();
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    const res = await roadmapApi.generateRoadmap({ targetRole });
    if (res.success) {
      await fetchRoadmap();
      await refreshUser();
    } else {
      setError(res.error || "Failed to generate roadmap.");
    }
    setGenerating(false);
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const filteredMilestones = milestones.filter((m) => {
    if (filter === "completed") return m.completed;
    if (filter === "pending") return !m.completed;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <GlassCard className="md:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Pathway: {targetRole}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="sky">{milestones.length} Milestones</Badge>
              <GlowButton onClick={handleGenerate} disabled={generating} size="sm">
                {generating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                <span>Regenerate (2 ⚡)</span>
              </GlowButton>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
              <span className="text-xs text-slate-500">Completed</span>
              <p className="text-xl font-extrabold text-emerald-500">{completedCount} Milestones</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
              <span className="text-xs text-slate-500">Remaining</span>
              <p className="text-xl font-extrabold text-sky-500">{milestones.length - completedCount} Milestones</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
              <span className="text-xs text-slate-500">Next Action</span>
              <p className="text-xs font-bold text-amber-500 truncate">
                {milestones.find((m) => !m.completed)?.title || "All Completed! 🎉"}
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="md:col-span-4 text-center flex flex-col items-center justify-center">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Overall Roadmap Completion
          </span>
          <ProgressRing progress={progressPercent} size={130} label={`${progressPercent}%`} color="emerald" />
        </GlassCard>
      </div>

      {/* Interactive Milestone Nodes Flow */}
      <GlassCard className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
            Curated Action Plan Nodes
          </h4>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                filter === "all" ? "bg-sky-500 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All ({milestones.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                filter === "pending" ? "bg-sky-500 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Pending ({milestones.length - completedCount})
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                filter === "completed" ? "bg-sky-500 text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">Loading your roadmap...</p>
          </div>
        ) : filteredMilestones.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">No milestones found.</p>
          </div>
        ) : (
          /* Vertical Timeline Nodes */
          <div className="relative space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
            {filteredMilestones.map((m) => (
              <div key={m.id} className="relative pl-10 space-y-2 group">
                {/* Checkbox Node Icon */}
                <button
                  onClick={() => toggleComplete(m.id)}
                  className={`absolute left-0 top-1 p-1 rounded-full border transition-all ${
                    m.completed
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-slate-900 text-slate-500 border-slate-700 hover:border-sky-500"
                  }`}
                >
                  {m.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>

                <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 space-y-2 hover:border-sky-500/50 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={m.completed ? "emerald" : "sky"}>{m.stage}</Badge>
                      <h5 className={`text-sm font-bold ${m.completed ? "line-through text-slate-400" : "text-slate-900 dark:text-white"}`}>
                        {m.title}
                      </h5>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {m.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                        {m.resourceCount} Resources
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
