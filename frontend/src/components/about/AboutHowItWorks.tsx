"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UserPlus,
  FileCheck,
  Zap,
  TrendingDown,
  Compass,
  ArrowRight,
} from "lucide-react";

export const AboutHowItWorks: React.FC = () => {
  const steps = [
    {
      num: "01",
      title: "Create Your Account",
      desc: "Set up your secure Nexora account and define your primary target career role (e.g. Full-Stack Developer, AI Engineer, Data Scientist).",
      icon: UserPlus,
      color: "from-blue-500 to-cyan-500",
    },
    {
      num: "02",
      title: "Build Your Career Profile",
      desc: "Upload your existing resume, connect your public GitHub handle, and select target job criteria for automated parsing.",
      icon: FileCheck,
      color: "from-cyan-500 to-indigo-500",
    },
    {
      num: "03",
      title: "Practice & Get Evaluated",
      desc: "Solve Coding Arena challenges, take AI Mock Interviews, and complete technical MCQs evaluated by our intelligence services.",
      icon: Zap,
      color: "from-indigo-500 to-purple-500",
    },
    {
      num: "04",
      title: "Understand Your Skill Gaps",
      desc: "Review your Placement Readiness score, ATS keyword matching, and personalized AI feedback highlighting exact areas to strengthen.",
      icon: TrendingDown,
      color: "from-purple-500 to-rose-500",
    },
    {
      num: "05",
      title: "Prepare With Intelligence",
      desc: "Follow targeted learning roadmaps, talk to your AI Career Mentor, and apply directly to matching job opportunities.",
      icon: Compass,
      color: "from-rose-500 to-amber-500",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <span>STEP-BY-STEP WORKFLOW</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Nexora AI</span> Works
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            A structured, 5-step intelligent workflow that turns ambition into verifiable career readiness.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical connecting line for desktop & mobile */}
          <div className="hidden lg:block absolute top-12 bottom-12 left-1/2 w-0.5 bg-gradient-to-b from-cyan-500 via-indigo-500 to-amber-500 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`flex flex-col lg:flex-row items-center ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-16`}
                >
                  {/* Text content side */}
                  <div className={`w-full lg:w-1/2 ${isEven ? "lg:text-right" : "lg:text-left"}`}>
                    <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300 shadow-xl space-y-3">
                      <div className={`inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 ${isEven ? "lg:justify-end" : ""}`}>
                        <span>STEP {step.num}</span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        {step.title}
                      </h3>

                      <p className="text-sm text-slate-400 leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Icon Node Center */}
                  <div className="relative z-10 shrink-0">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-0.5 shadow-xl shadow-indigo-950/60 flex items-center justify-center`}>
                      <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                        <IconComp className="w-7 h-7 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Spacer for layout symmetry */}
                  <div className="hidden lg:block w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
