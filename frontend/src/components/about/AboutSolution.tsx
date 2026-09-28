"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  FileText,
  Target,
  BookOpen,
  Code2,
  Video,
  GitBranch,
  Briefcase,
  Award,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const AboutSolution: React.FC = () => {
  const pipelineSteps = [
    { name: "PROFILE", desc: "Target Role & Goal Setting", icon: User, color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
    { name: "RESUME", desc: "ATS Parsing & Analysis", icon: FileText, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
    { name: "SKILLS", desc: "Skill Mapping & Diagnosis", icon: Target, color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
    { name: "LEARNING", desc: "Curated Roadmaps", icon: BookOpen, color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
    { name: "CODING", desc: "Algorithmic Arena", icon: Code2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
    { name: "INTERVIEW", desc: "AI Mock Sessions", icon: Video, color: "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30" },
    { name: "GITHUB", desc: "Repo Quality Insights", icon: GitBranch, color: "text-violet-400 bg-violet-500/10 border-violet-500/30" },
    { name: "JOB DISCOVERY", desc: "Matching Roles", icon: Briefcase, color: "text-sky-400 bg-sky-500/10 border-sky-500/30" },
    { name: "READINESS", desc: "Career Readiness", icon: Award, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/80 relative border-t border-b border-slate-800/80 overflow-hidden">
      {/* Glow gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>THE SOLUTION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            One Platform. Your Complete <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Career Journey</span>.
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            From your initial candidate profile to your final placement assessment, Nexora orchestrates a seamless pipeline for your professional growth.
          </p>
        </div>

        {/* Desktop Pipeline (Horizontal Grid / Scroll) */}
        <div className="hidden lg:block relative py-6">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-blue-500/30 via-purple-500/40 to-amber-500/30 -translate-y-6 pointer-events-none" />

          <div className="grid grid-cols-9 gap-2">
            {pipelineSteps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={step.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex flex-col items-center text-center group relative z-10"
                >
                  <div className={`w-12 h-12 rounded-2xl border ${step.color} flex items-center justify-center mb-3 shadow-lg bg-slate-950 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-white tracking-wider mb-1">
                    {step.name}
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight max-w-[100px]">
                    {step.desc}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile / Tablet Pipeline (Vertical Timeline) */}
        <div className="lg:hidden max-w-md mx-auto relative pl-6 space-y-6 border-l-2 border-slate-800">
          {pipelineSteps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <motion.div
                key={step.name}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative flex items-start gap-4"
              >
                {/* Node Bullet */}
                <div className={`absolute -left-[31px] top-1.5 w-6 h-6 rounded-full border ${step.color} bg-slate-950 flex items-center justify-center shrink-0`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current" />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 w-full flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${step.color} bg-slate-900 shrink-0`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wider">{step.name}</h4>
                    <p className="text-[11px] text-slate-400">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
