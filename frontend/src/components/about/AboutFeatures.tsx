"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Video,
  Code2,
  Brain,
  GitBranch,
  Target,
  Briefcase,
  GraduationCap,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";

export const AboutFeatures: React.FC = () => {
  const features = [
    {
      num: "FEATURE 01",
      title: "Resume Intelligence",
      icon: FileText,
      color: "from-blue-500/20 to-cyan-500/10 border-cyan-500/30 text-cyan-400",
      btnGradient: "from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500",
      description: "Comprehensive ATS-oriented resume parsing and feedback engine.",
      items: [
        "Resume upload & multi-format support",
        "Automated skills, education & experience extraction",
        "ATS score benchmark & keyword matching",
        "AI feedback & section-by-section improvements",
      ],
      ctaText: "Explore Resume Intelligence",
      route: "/features/resume",
    },
    {
      num: "FEATURE 02",
      title: "AI Mock Interview",
      icon: Video,
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
      btnGradient: "from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500",
      description: "Interactive AI practice for technical, behavioral, and HR interviews.",
      items: [
        "HR, Technical, and Behavioral interview modules",
        "Role-specific dynamic question generation",
        "Customizable difficulty selection (Easy, Medium, Hard)",
        "Instant AI evaluation & detailed performance feedback",
      ],
      ctaText: "Practice an Interview",
      route: "/features/interview",
    },
    {
      num: "FEATURE 03",
      title: "Coding Arena",
      icon: Code2,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
      btnGradient: "from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500",
      description: "Algorithmic problem-solving workspace with real-time evaluation.",
      items: [
        "Curated algorithmic coding challenges",
        "Multi-language support (Python, JS, TS, Java, C++)",
        "Live code execution & automated test cases",
        "Problem solving statistics & progress tracking",
      ],
      ctaText: "Enter Coding Arena",
      route: "/features/coding",
    },
    {
      num: "FEATURE 04",
      title: "AI Career Mentor",
      icon: Brain,
      color: "from-violet-500/20 to-fuchsia-500/10 border-violet-500/30 text-violet-400",
      btnGradient: "from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500",
      description: "Personalized AI copilot for ongoing career guidance and advice.",
      items: [
        "Instant answers to technical & career questions",
        "Personalized learning guidance & skill advice",
        "Strategic interview preparation strategies",
        "Tailored long-term career planning roadmaps",
      ],
      ctaText: "Talk to AI Mentor",
      route: "/features/mentor",
    },
    {
      num: "FEATURE 05",
      title: "GitHub Intelligence",
      icon: GitBranch,
      color: "from-cyan-500/20 to-blue-500/10 border-blue-500/30 text-blue-400",
      btnGradient: "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
      description: "Automated analysis of developer repositories and code quality.",
      items: [
        "Public repository analysis & stack detection",
        "Code complexity & architecture pattern evaluation",
        "Commit contribution & activity insights",
        "Developer portfolio strength & resume alignment",
      ],
      ctaText: "Analyze GitHub",
      route: "/features/github",
    },
    {
      num: "FEATURE 06",
      title: "Placement Intelligence",
      icon: Target,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
      btnGradient: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
      description: "Holistic readiness diagnosis for campus and industry hiring.",
      items: [
        "Comprehensive career readiness score calculation",
        "Detailed identification of key strengths & skill gaps",
        "Targeted preparation area recommendations",
        "Historical career progress tracking over time",
      ],
      ctaText: "View Placement Intelligence",
      route: "/features/placement",
    },
    {
      num: "FEATURE 07",
      title: "Job Discovery",
      icon: Briefcase,
      color: "from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-400",
      btnGradient: "from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500",
      description: "Intelligent role matching and job vacancy discovery engine.",
      items: [
        "Real-time relevant job opportunities feed",
        "Target role & skill-based job matching",
        "Awareness of specific job requirements & tech stack",
        "Direct connection to preparation context",
      ],
      ctaText: "Explore Jobs",
      route: "/features/analytics",
    },
    {
      num: "FEATURE 08",
      title: "Learning Hub",
      icon: GraduationCap,
      color: "from-purple-500/20 to-rose-500/10 border-purple-500/30 text-purple-400",
      btnGradient: "from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500",
      description: "Structured learning paths integrated with freeCodeCamp API.",
      items: [
        "Curated skill development & learning paths",
        "Career-focused technical curriculum",
        "Structured interview preparation courses",
        "Interactive progress tracking & milestones",
      ],
      ctaText: "Explore Learning",
      route: "/features/learning",
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>CORE PLATFORM MODULES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to Become <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Career-Ready</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Eight interconnected AI modules working together to build your candidate profile, sharpen your skills, and get you hired.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((f, idx) => {
            const IconComp = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-3xl bg-slate-900/60 p-8 border border-slate-800/90 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-indigo-950/40 backdrop-blur-md"
              >
                <div className="space-y-6">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-wider">
                      {f.num}
                    </span>
                    <div className={`p-3 rounded-2xl bg-gradient-to-br border ${f.color}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {f.description}
                    </p>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                    {f.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-8">
                  <Link
                    href={f.route}
                    className={`w-full py-3.5 px-6 rounded-xl bg-gradient-to-r ${f.btnGradient} text-white text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 group/btn`}
                  >
                    <span>{f.ctaText}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
