"use client";

import React, { useState } from "react";
import {
  FileText,
  Code2,
  Video,
  Award,
  Cpu,
  Sparkles,
  Compass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { GithubIcon } from "@/components/common/GithubIcon";

export function CareerIntelligence() {
  const [activeInput, setActiveInput] = useState<string>("resume");

  const inputs = [
    { id: "resume", name: "Resume & ATS Data", icon: FileText, score: "84/100" },
    { id: "coding", name: "Coding Arena Performance", icon: Code2, score: "72/100" },
    { id: "interview", name: "Mock Interview Telemetry", icon: Video, score: "76/100" },
    { id: "github", name: "GitHub Portfolio Audits", icon: GithubIcon, score: "81/100" },
    { id: "skills", name: "Core CS Assessments", icon: Award, score: "78/100" },
  ];

  return (
    <section className="py-20 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-sky-500/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider border border-sky-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Signature Architecture</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Everything you do becomes part of your career intelligence.
          </h2>

          <p className="text-base sm:text-lg text-slate-400">
            Unlike fragmented tools, Nexora aggregates signals from your resume, code submissions, mock interviews, and GitHub repos into one unified AI Career Engine.
          </p>
        </div>

        {/* Interactive Visual Diagram */}
        <div className="p-6 md:p-10 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Step 1: Input Data Signals */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                1. Multi-Signal Data Ingestion
              </span>
              {inputs.map((item) => {
                const Icon = item.icon;
                const isActive = activeInput === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveInput(item.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                      isActive
                        ? "bg-sky-500/15 border-sky-500 text-white shadow-lg shadow-sky-500/10"
                        : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-400"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">{item.name}</span>
                    </div>
                    <span className="text-xs font-mono font-medium text-sky-400">{item.score}</span>
                  </button>
                );
              })}
            </div>

            {/* Step 2: AI Core Engine */}
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-gradient-to-b from-sky-950/40 to-slate-900 border border-sky-500/30 text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40 shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Nexora AI Career Engine</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesizing skill matrices, ATS parsing, code quality, STAR sentiment, & GitHub commits.
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-medium border border-sky-500/30">
                Processing 5 Active Data Streams
              </div>
            </div>

            {/* Step 3: Targeted Recommendations & Roadmap */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                3. Actionable Career Output
              </span>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-sky-400">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Overall Career Readiness
                  </span>
                  <span>78% Ready</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full w-[78%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Compass className="w-4 h-4 text-sky-400" />
                  <span>Personalized Weekly Roadmap</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Focus on Graphs & Dynamic Programming this week to bridge your tier-1 technical gap.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>AI Mock Interview Prep</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Practice System Design interview round targeting scalable cache architecture.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
