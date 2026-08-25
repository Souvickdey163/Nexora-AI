"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Video,
  Code2,
  FolderGit2,
  BarChart3,
  Bot,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export function DashboardFeatureHub() {
  const ENGINES = [
    {
      name: "AI Resume Intelligence",
      description: "Real-time ATS scoring, keyword gap analysis & action-verb rewriter.",
      stat: "88% ATS Score",
      href: "/resume",
      icon: FileText,
      badgeColor: "text-sky-400 bg-sky-500/10 border-sky-500/30",
    },
    {
      name: "Interactive Mock Interviews",
      description: "STAR method audio voice simulations with instant AI feedback.",
      stat: "12 Rounds Completed",
      href: "/interview",
      icon: Video,
      badgeColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    },
    {
      name: "Coding Arena & DSA Practice",
      description: "Curated tech assessment problems with step-by-step space/time hints.",
      stat: "42 Problems Solved",
      href: "/coding",
      icon: Code2,
      badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      name: "GitHub Repository Intelligence",
      description: "Deep repository scan analyzing code quality, architecture & test depth.",
      stat: "Grade A Architecture",
      href: "/github",
      icon: FolderGit2,
      badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl space-y-8">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-800 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nexora AI Suite</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            You&apos;ve Taken the First Step — Let&apos;s Go Further
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            You&apos;ve already started your preparation journey. Now explore all AI-powered engines engineered to help you land job offers faster.
          </p>
        </div>

        <Link
          href="/analytics"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs transition-colors shrink-0"
        >
          <span>Explore 360° Analytics</span>
          <ArrowRight className="w-4 h-4 text-sky-400" />
        </Link>
      </div>

      {/* Grid Content: Left Engines Cards + Right 3D Orbital Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: 4 Intelligence Engines Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ENGINES.map((engine) => {
            const Icon = engine.icon;
            return (
              <Link
                key={engine.name}
                href={engine.href}
                className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/90 hover:border-sky-500/50 hover:bg-slate-800/60 transition-all duration-300 group flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 group-hover:bg-sky-500 text-slate-300 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${engine.badgeColor}`}>
                    {engine.stat}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors flex items-center justify-between">
                    <span>{engine.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {engine.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Right Side: 3D Orbital Hub Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center p-6">
          <div className="relative w-64 h-64 flex items-center justify-center">
            
            {/* Outer Orbit Ring */}
            <div className="absolute inset-0 rounded-full border border-sky-500/30 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border border-indigo-500/20" />

            {/* Central Glowing Orb */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold shadow-2xl shadow-sky-500/40 z-10">
              <Zap className="w-9 h-9 text-white animate-pulse" />
            </div>

            {/* Orbiting Satellite Nodes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-800 border border-sky-400 text-sky-400 flex items-center justify-center text-xs shadow-lg">
              <FileText className="w-4 h-4" />
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-9 h-9 rounded-full bg-slate-800 border border-indigo-400 text-indigo-400 flex items-center justify-center text-xs shadow-lg">
              <Video className="w-4 h-4" />
            </div>

            <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-800 border border-cyan-400 text-cyan-400 flex items-center justify-center text-xs shadow-lg">
              <Code2 className="w-4 h-4" />
            </div>

            <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-800 border border-emerald-400 text-emerald-400 flex items-center justify-center text-xs shadow-lg">
              <FolderGit2 className="w-4 h-4" />
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
