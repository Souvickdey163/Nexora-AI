"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Brain,
  FileText,
  Code2,
  GitBranch,
  Video,
  Target,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AboutHero: React.FC = () => {
  const { isLoggedIn } = useAuth();

  const primaryHref = isLoggedIn ? "/dashboard" : "/auth";

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ecosystemNodes = [
    { icon: FileText, label: "Resume Intelligence", color: "from-blue-500 to-cyan-400", delay: 0 },
    { icon: Code2, label: "Coding Arena", color: "from-emerald-500 to-teal-400", delay: 0.1 },
    { icon: Video, label: "AI Mock Interview", color: "from-indigo-500 to-purple-400", delay: 0.2 },
    { icon: GitBranch, label: "GitHub Intelligence", color: "from-violet-500 to-fuchsia-400", delay: 0.3 },
    { icon: Brain, label: "AI Career Mentor", color: "from-cyan-500 to-blue-400", delay: 0.4 },
    { icon: Target, label: "Placement Intelligence", color: "from-amber-500 to-orange-400", delay: 0.5 },
    { icon: Briefcase, label: "Job Discovery", color: "from-sky-500 to-indigo-400", delay: 0.6 },
    { icon: GraduationCap, label: "Learning Hub", color: "from-rose-500 to-pink-400", delay: 0.7 },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-slate-950 text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Mission Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-300">
                OUR MISSION
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              About <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Nexora AI</span>
            </h1>

            {/* Supporting Headline */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-200 leading-snug">
              Your AI-powered career copilot for becoming job-ready.
            </p>

            {/* Detailed Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Nexora AI brings career preparation, skill development, resume intelligence, interview practice, coding, GitHub insights, and job discovery into one intelligent platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href={primaryHref}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Start Your Career Journey</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#features"
                onClick={scrollToFeatures}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <Compass className="w-5 h-5 text-indigo-400" />
                <span>Explore Nexora Features</span>
              </a>
            </div>

            {/* Trust highlights */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Production Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Real-Time AI Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Unified Intelligence Hub</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: AI Career Brain Ecosystem Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl shadow-indigo-950/50">
              {/* Glow border ring */}
              <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-indigo-500/30 to-purple-500/20 blur opacity-75 group-hover:opacity-100 transition duration-1000 pointer-events-none" />

              <div className="relative space-y-6">
                {/* Visual Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Nexora AI Career Engine</h3>
                      <p className="text-[11px] text-slate-400">Unified Career Intelligence Network</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Active Engine
                  </span>
                </div>

                {/* Central Brain Node */}
                <div className="py-2 text-center relative">
                  <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/40 shadow-xl">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                    <span className="text-xs font-bold tracking-wide uppercase bg-gradient-to-r from-cyan-300 to-indigo-200 bg-clip-text text-transparent">
                      NEXORA CAREER ECOSYSTEM
                    </span>
                  </div>
                </div>

                {/* Connected Nodes Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {ecosystemNodes.map((node, i) => {
                    const IconComp = node.icon;
                    return (
                      <motion.div
                        key={node.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + node.delay }}
                        className="group flex items-center gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center shrink-0 shadow-sm`}>
                          <IconComp className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                            {node.label}
                          </p>
                          <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className={`bg-gradient-to-r ${node.color} h-full rounded-full w-full opacity-75`} />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Integrated Footer Note */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>8 Core Intelligence Services</span>
                  <span className="text-indigo-400 font-medium">100% Interconnected</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
