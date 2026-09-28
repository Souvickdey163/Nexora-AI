"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Layout,
  Server,
  Lock,
  Database,
  Cpu,
  Brain,
  GitBranch,
  Briefcase,
  FileText,
  ArrowRight,
  ArrowDown,
  Sparkles,
} from "lucide-react";

export const AboutArchitecture: React.FC = () => {
  const layers = [
    { label: "USER INTERFACE", name: "Next.js 16 Client App", icon: Layout, color: "border-cyan-500/30 text-cyan-400 bg-cyan-500/10" },
    { label: "GATEWAY", name: "Express REST API Engine", icon: Server, color: "border-blue-500/30 text-blue-400 bg-blue-500/10" },
    { label: "SECURITY", name: "JWT Auth & Middleware", icon: Lock, color: "border-indigo-500/30 text-indigo-400 bg-indigo-500/10" },
    { label: "DATA PERSISTENCE", name: "PostgreSQL + Prisma ORM", icon: Database, color: "border-purple-500/30 text-purple-400 bg-purple-500/10" },
    { label: "AI MICROSERVICES", name: "Python FastAPI & AI Engines", icon: Cpu, color: "border-rose-500/30 text-rose-400 bg-rose-500/10" },
    { label: "INTELLIGENCE LAYER", name: "Nexora Career Intelligence", icon: Brain, color: "border-amber-500/30 text-amber-400 bg-amber-500/10" },
  ];

  const externalIntegrations = [
    { name: "GitHub Integration", desc: "Repository analysis & commit telemetry", icon: GitBranch },
    { name: "Jobvetta Jobs API", desc: "Live vacancy discovery & role requirements", icon: Briefcase },
    { name: "Resume Processor", desc: "Multi-format document text extraction", icon: FileText },
    { name: "QuizAPI Integration", desc: "Technical MCQ interview generation", icon: Sparkles },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>SYSTEM DESIGN</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Inside <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Nexora AI</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            A high-level view of how candidate data flows seamlessly from request to career intelligence.
          </p>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="rounded-3xl bg-slate-900/60 p-6 sm:p-10 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-12">
          {/* Main Pipeline Flow */}
          <div className="space-y-4">
            <h3 className="text-sm font-mono font-bold text-slate-400 uppercase text-center mb-6">
              CORE APPLICATION DATAFLOW
            </h3>

            {/* Desktop Horizontal Flow */}
            <div className="hidden lg:grid grid-cols-6 gap-3 items-center">
              {layers.map((layer, idx) => {
                const IconComp = layer.icon;
                return (
                  <React.Fragment key={layer.name}>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 hover:border-slate-700 transition"
                    >
                      <div className={`w-10 h-10 rounded-xl border ${layer.color} flex items-center justify-center mx-auto`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="block text-[10px] font-mono text-slate-400">{layer.label}</span>
                      <h4 className="text-xs font-bold text-white">{layer.name}</h4>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile / Tablet Vertical Flow */}
            <div className="lg:hidden space-y-3 max-w-md mx-auto">
              {layers.map((layer, idx) => {
                const IconComp = layer.icon;
                return (
                  <div key={layer.name} className="flex flex-col items-center">
                    <div className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl border ${layer.color} shrink-0`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[10px] font-mono text-slate-400">{layer.label}</span>
                        <h4 className="text-xs font-bold text-white">{layer.name}</h4>
                      </div>
                    </div>
                    {idx < layers.length - 1 && (
                      <ArrowDown className="w-4 h-4 text-slate-600 my-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Connected Integrations Section */}
          <div className="pt-8 border-t border-slate-800/80 space-y-6">
            <h3 className="text-sm font-mono font-bold text-slate-400 uppercase text-center">
              CONNECTED INTEGRATION SERVICES
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {externalIntegrations.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div key={item.name} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
