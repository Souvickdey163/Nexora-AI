"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Code,
  LineChart,
  TrendingUp,
  Award,
  Layers,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const AboutMission: React.FC = () => {
  const highlights = [
    { label: "Learn", desc: "Targeted skill paths & structured resources", icon: BookOpen, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
    { label: "Practice", desc: "Algorithmic challenges & AI mock interviews", icon: Code, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
    { label: "Measure", desc: "ATS scoring, code correctness & benchmark stats", icon: LineChart, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
    { label: "Improve", desc: "Personalized AI feedback & actionable skill gaps", icon: TrendingUp, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    { label: "Get Ready", desc: "Job role matching & placement readiness confidence", icon: Award, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>OUR PURPOSE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why We Built <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Nexora</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Career preparation shouldn&apos;t require juggling seven different subscriptions and platforms. We built Nexora to unify every step of becoming job-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Large Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl bg-slate-950 p-8 border border-slate-800 shadow-2xl overflow-hidden group hover:border-indigo-500/50 transition-all duration-500">
              {/* Background gradient blob */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    SYSTEM ARCHITECTURE
                  </span>
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>

                <h3 className="text-2xl font-bold text-white leading-snug">
                  Career Preparation Re-imagined
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed">
                  Traditionally, candidates use separate tools for resume parsing, mock interviews, LeetCode, GitHub analysis, and job hunting. Nexora fuses these into a single synchronized intelligence core.
                </p>

                {/* Ecosystem checklist visual */}
                <div className="space-y-3 pt-2">
                  {[
                    "Unified candidate profile context",
                    "Continuous skill gap diagnosis",
                    "Automated ATS resume evaluation",
                    "Realistic AI interview simulations",
                    "Direct placement readiness metrics",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Single Sign-On & Data Sync</span>
                  <span className="text-emerald-400 font-semibold">100% Unified</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Mission Explanation & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8"
          >
            <div className="space-y-4 text-slate-300">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Closing the gap between graduation and employment
              </h3>

              <p className="text-sm sm:text-base leading-relaxed text-slate-400">
                Students and early-career developers face an increasingly competitive hiring landscape. Recruiters use automated ATS filters, complex coding rounds, and technical behavioral interviews. Yet, candidate preparation remains fragmented across dozens of disconnected websites.
              </p>

              <p className="text-sm sm:text-base leading-relaxed text-slate-400">
                Nexora AI brings clarity to this process. By connecting your resume, coding performance, mock interview results, and GitHub activity into one platform, Nexora gives you an accurate picture of your career readiness and guides you step-by-step toward your target role.
              </p>
            </div>

            {/* Small Highlights Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {highlights.map((h, i) => {
                const IconComp = h.icon;
                return (
                  <motion.div
                    key={h.label}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className={`p-2 rounded-xl border ${h.color}`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{h.label}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">{h.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
