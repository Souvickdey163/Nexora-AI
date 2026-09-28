"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Compass,
  Sparkles,
  TrendingUp,
  Brain,
  GitBranch,
  Target,
  LineChart,
} from "lucide-react";

export const AboutFutureVision: React.FC = () => {
  const visionItems = [
    {
      title: "Personalized Career Forecasting",
      desc: "Developing predictive AI models to estimate skill trajectory timelines for target roles.",
      icon: LineChart,
    },
    {
      title: "Smarter Job Matching Algorithms",
      desc: "Expanding real-time vacancy filtering to match candidates based on proven coding & interview performance.",
      icon: Target,
    },
    {
      title: "Adaptive Voice & Video Simulations",
      desc: "Enhancing AI mock interviews with dynamic behavioral voice evaluation and body language cues.",
      icon: Brain,
    },
    {
      title: "Deeper GitHub Repository Insights",
      desc: "Building advanced AST code quality parsers to evaluate architectural design patterns in candidate repositories.",
      icon: GitBranch,
    },
    {
      title: "Customized Adaptive Learning Paths",
      desc: "Automating curriculum generation that dynamically adjusts course modules based on real-time quiz performance.",
      icon: Compass,
    },
    {
      title: "Direct Recruiter Readiness Verification",
      desc: "Enabling verified candidate skill badges that recruiters can inspect directly without traditional resume clutter.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span>PRODUCT ROADMAP & VISION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Where We&apos;re <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Going</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Our vision for the next generation of AI career copilot technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visionItems.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-3 group backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    FUTURE DIRECTION
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
