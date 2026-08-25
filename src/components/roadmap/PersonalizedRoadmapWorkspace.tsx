"use client";

import React, { useState } from "react";
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
  Plus,
  Filter,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

interface Milestone {
  id: string;
  stage: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  completed: boolean;
  resourceCount: number;
}

const INITIAL_MILESTONES: Milestone[] = [
  {
    id: "m1",
    stage: "Foundation",
    title: "TypeScript & ES6+ Advanced Mastery",
    description: "Master Generics, Union Types, Utility Types, Async/Await concurrency, and Event Loop internals.",
    difficulty: "Beginner",
    estimatedTime: "1 Week",
    completed: true,
    resourceCount: 5,
  },
  {
    id: "m2",
    stage: "DSA",
    title: "Arrays, Strings & Two Pointer Patterns",
    description: "Solve 25 sliding window, two pointer, and prefix sum challenges in Coding Arena.",
    difficulty: "Intermediate",
    estimatedTime: "2 Weeks",
    completed: true,
    resourceCount: 8,
  },
  {
    id: "m3",
    stage: "Core CS",
    title: "PostgreSQL & Database Normalization",
    description: "Study ACID properties, B-Tree indexes, query execution plans, and Prisma ORM migrations.",
    difficulty: "Intermediate",
    estimatedTime: "1.5 Weeks",
    completed: false,
    resourceCount: 6,
  },
  {
    id: "m4",
    stage: "Projects",
    title: "Full-Stack AI Project Deployment",
    description: "Build & deploy Next.js 15 + Express + PostgreSQL production app with GitHub Intelligence integration.",
    difficulty: "Advanced",
    estimatedTime: "2 Weeks",
    completed: false,
    resourceCount: 4,
  },
  {
    id: "m5",
    stage: "Interview",
    title: "System Design & Mock Interview Panels",
    description: "Complete 3 AI mock interview sessions focusing on rate limiters, caching, and STAR behavioral answers.",
    difficulty: "Advanced",
    estimatedTime: "1 Week",
    completed: false,
    resourceCount: 7,
  },
];

export function PersonalizedRoadmapWorkspace() {
  const [milestones, setMilestones] = useState<Milestone[]>(INITIAL_MILESTONES);
  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");

  const toggleComplete = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);

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
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-sky-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Personalized Staff Engineer Pathway
              </h3>
            </div>
            <Badge variant="sky">6 Weeks Schedule</Badge>
          </div>

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
              <p className="text-xs font-bold text-amber-500 truncate">PostgreSQL & DB Indexing</p>
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

        {/* Vertical Timeline Nodes */}
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
      </GlassCard>
    </div>
  );
}
