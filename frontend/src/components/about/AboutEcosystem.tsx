"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Video,
  Code2,
  Brain,
  GitBranch,
  Target,
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
} from "lucide-react";

export const AboutEcosystem: React.FC = () => {
  const satellites = [
    { name: "Resume", icon: FileText, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { name: "Interview", icon: Video, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    { name: "Coding", icon: Code2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { name: "Mentor", icon: Brain, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { name: "GitHub", icon: GitBranch, color: "text-violet-400 bg-violet-500/10 border-violet-500/30" },
    { name: "Skills", icon: Target, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
    { name: "Learning", icon: GraduationCap, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
    { name: "Jobs", icon: Briefcase, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
    { name: "Placement", icon: Award, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80 overflow-hidden">
      {/* Background glow radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>PRODUCT NETWORK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            The Nexora <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Ecosystem</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Nine specialized modules bound together by a unified intelligence engine.
          </p>
        </div>

        {/* Ecosystem Radial Container */}
        <div className="max-w-4xl mx-auto relative p-8 sm:p-12 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          {/* Central Core */}
          <div className="text-center py-8 relative z-10 space-y-4">
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 mx-auto shadow-2xl shadow-indigo-500/30"
            >
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-3 text-center">
                <Brain className="w-8 h-8 text-cyan-400 mb-1 animate-pulse" />
                <span className="text-[11px] font-extrabold text-white tracking-wider uppercase">NEXORA AI</span>
                <span className="text-[9px] text-indigo-300 font-mono">CORE ENGINE</span>
              </div>
            </motion.div>

            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Every action taken in any module updates your overall career profile and readiness metrics in real time.
            </p>
          </div>

          {/* Interconnected Satellites Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 relative z-10 pt-4">
            {satellites.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all duration-300 text-center space-y-2 group hover:scale-105"
                >
                  <div className={`w-9 h-9 rounded-xl border ${item.color} flex items-center justify-center mx-auto`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.name}
                  </h3>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
