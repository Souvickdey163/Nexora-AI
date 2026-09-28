"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Code2,
  Video,
  GitBranch,
  Target,
  Briefcase,
  Activity,
  Sparkles,
} from "lucide-react";
import { UserCareerSummaryData } from "@/lib/api/about";

interface AboutCareerIntelligenceProps {
  userSummary: UserCareerSummaryData | null;
  isLoggedIn: boolean;
}

export const AboutCareerIntelligence: React.FC<AboutCareerIntelligenceProps> = ({
  userSummary,
  isLoggedIn,
}) => {
  const signalCards = [
    {
      title: "Resume",
      sub: "ATS Analysis",
      icon: FileText,
      color: "border-blue-500/30 text-blue-400 bg-blue-500/10",
      statusLabel: isLoggedIn && userSummary
        ? `${userSummary.careerStats.resumesUploaded} Resumes Analyzed`
        : "Resume Parsing & ATS Feedback",
      details: "Skills, experience & education extracted via dynamic NLP engines.",
    },
    {
      title: "Coding",
      sub: "Problem Solving",
      icon: Code2,
      color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
      statusLabel: isLoggedIn && userSummary
        ? `${userSummary.careerStats.codingProblemsSolved} Challenges Solved`
        : "Code Execution & Test Validation",
      details: "Multi-language runtime verification with time & memory limit benchmarks.",
    },
    {
      title: "Interview",
      sub: "Interview Performance",
      icon: Video,
      color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10",
      statusLabel: isLoggedIn && userSummary
        ? `${userSummary.careerStats.mockTestsCompleted} Mock Sessions Completed`
        : "Technical & Behavioral Practice",
      details: "Role-customized STAR evaluation & interactive AI interview scoring.",
    },
    {
      title: "GitHub",
      sub: "Project Intelligence",
      icon: GitBranch,
      color: "border-purple-500/30 text-purple-400 bg-purple-500/10",
      statusLabel: isLoggedIn && userSummary
        ? userSummary.careerStats.githubConnected ? "GitHub Connected" : "Not Connected Yet"
        : "Repo Quality & Tech Stack Analysis",
      details: "Commit frequency, tech stack detection, and project complexity scoring.",
    },
    {
      title: "Skills",
      sub: "Skill Profile",
      icon: Target,
      color: "border-amber-500/30 text-amber-400 bg-amber-500/10",
      statusLabel: isLoggedIn && userSummary
        ? `${userSummary.careerStats.roadmapsCreated} Roadmaps Active`
        : "Skill Gap Identification",
      details: "Continuous skill mapping against current industry job posting requirements.",
    },
    {
      title: "Jobs",
      sub: "Opportunity Discovery",
      icon: Briefcase,
      color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10",
      statusLabel: isLoggedIn && userSummary
        ? `${userSummary.careerStats.placementAssessmentsCompleted} Readiness Assessments`
        : "Role Matching & Job Feed",
      details: "Live job vacancies fetched and matched to candidate skill profiles.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>DATA-DRIVEN CAREERS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Your Career, Understood as <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Data</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Nexora synthesizes multiple career signals into actionable insights, removing ambiguity from candidate preparation.
          </p>
        </div>

        {/* Dashboard Grid Visualization */}
        <div className="rounded-3xl bg-slate-900/60 p-6 sm:p-8 border border-slate-800 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">
                NEXORA INTELLIGENCE DASHBOARD MATRIX
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoggedIn ? "Authenticated Telemetry Sync" : "System Telemetry Architecture"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signalCards.map((card, idx) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl border ${card.color}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-[11px] text-slate-400">{card.sub}</p>
                        </div>
                      </div>
                    </div>

                    {/* Status pill */}
                    <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200">
                      {card.statusLabel}
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {card.details}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>SIGNAL ACTIVE</span>
                    <span className="text-cyan-400 font-semibold">SYNCHRONIZED</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
