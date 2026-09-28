"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Cpu,
  ShieldCheck,
  Zap,
  Globe,
  Layers,
} from "lucide-react";

export const AboutTechnology: React.FC = () => {
  const techStack = [
    {
      name: "Next.js 16",
      desc: "App Router, Server Components & Turbopack build engine",
      category: "Frontend Framework",
      icon: Globe,
      color: "from-slate-700 to-slate-900 text-white border-slate-700",
    },
    {
      name: "React 19 & TypeScript",
      desc: "Type-safe UI components with full strict type definitions",
      category: "UI & Language",
      icon: Code2,
      color: "from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30",
    },
    {
      name: "Tailwind CSS & Glassmorphism",
      desc: "Custom dark-mode design system with responsive layouts",
      category: "Styling & UI Design",
      icon: Layers,
      color: "from-teal-500/20 to-emerald-500/10 text-teal-400 border-teal-500/30",
    },
    {
      name: "Node.js & Express REST API",
      desc: "High-throughput asynchronous backend server architecture",
      category: "Backend Services",
      icon: Server,
      color: "from-emerald-500/20 to-green-500/10 text-emerald-400 border-emerald-500/30",
    },
    {
      name: "Python & FastAPI AI Service",
      desc: "Fast, asynchronous microservice for AI processing & analysis",
      category: "AI Microservice",
      icon: Cpu,
      color: "from-indigo-500/20 to-purple-500/10 text-indigo-400 border-indigo-500/30",
    },
    {
      name: "PostgreSQL & Prisma ORM",
      desc: "Relational database schema with type-safe query generation",
      category: "Database & Data Layer",
      icon: Database,
      color: "from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/30",
    },
    {
      name: "JWT & Security Middleware",
      desc: "Role-based access control, bcrypt hashing & rate limiting",
      category: "Security & Auth",
      icon: ShieldCheck,
      color: "from-purple-500/20 to-fuchsia-500/10 text-purple-400 border-purple-500/30",
    },
    {
      name: "QuizAPI & freeCodeCamp APIs",
      desc: "External integrations for technical MCQs & curriculum data",
      category: "API Integrations",
      icon: Zap,
      color: "from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>ENGINEERING STACK</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Built With <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Modern Technology</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Nexora is engineered on a resilient, modern tech stack designed for speed, type safety, and production reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((tech, idx) => {
            const IconComp = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.07 }}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 group hover:-translate-y-1 backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl bg-gradient-to-br border ${tech.color}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase">
                    {tech.category}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {tech.name}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.desc}
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
