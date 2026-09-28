"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  FileQuestion,
  VideoOff,
  Compass,
  Target,
  FolderGit2,
  Search,
} from "lucide-react";

export const AboutProblem: React.FC = () => {
  const problems = [
    {
      num: "01",
      title: "Resume Uncertainty",
      desc: "Students often don't know how recruiters or ATS systems may evaluate their resume.",
      icon: FileQuestion,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
    {
      num: "02",
      title: "Interview Anxiety",
      desc: "Without realistic practice, technical and behavioral interviews can be difficult to prepare for.",
      icon: VideoOff,
      color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
    },
    {
      num: "03",
      title: "Scattered Learning",
      desc: "Learning resources are spread across multiple platforms.",
      icon: Compass,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-cyan-400",
    },
    {
      num: "04",
      title: "Skill Gaps",
      desc: "Students may not know which skills they need to strengthen for their target roles.",
      icon: Target,
      color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
    },
    {
      num: "05",
      title: "Weak Portfolio Understanding",
      desc: "Projects and GitHub activity don't always translate into clear career insights.",
      icon: FolderGit2,
      color: "from-violet-500/20 to-fuchsia-500/10 border-violet-500/30 text-violet-400",
    },
    {
      num: "06",
      title: "Job Discovery",
      desc: "Finding relevant roles and understanding their skill requirements can take significant effort.",
      icon: Search,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>THE CHALLENGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Career Preparation Is <span className="text-rose-400">Fragmented</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Navigating the transition from learning to getting hired is filled with disconnected tools, hidden expectations, and guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {problems.map((p, idx) => {
            const IconComp = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-2xl bg-slate-900/60 p-6 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 backdrop-blur-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br border ${p.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                      {p.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
