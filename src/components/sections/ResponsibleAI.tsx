"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, CheckCircle2, AlertCircle } from "lucide-react";

export function ResponsibleAI() {
  const principles = [
    {
      icon: ShieldCheck,
      title: "Assistance, Not Replacement",
      description: "Our AI models provide structured recommendations to augment your preparation, not make binding hiring decisions.",
    },
    {
      icon: Eye,
      title: "Transparent Scoring",
      description: "All ATS scores, interview telemetry, and readiness indexes are transparent, explainable data estimates.",
    },
    {
      icon: Lock,
      title: "Data Ownership & Security",
      description: "Your code, resumes, and interview practice recordings remain strictly private and encrypted under your control.",
    },
    {
      icon: AlertCircle,
      title: "Realistic Expectations",
      description: "We provide real-world insights and skill assessments without making unrealistic placement guarantees.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-semibold uppercase tracking-wider border border-sky-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical & Responsible AI</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            AI that assists your decisions — not replaces them.
          </h2>

          <p className="text-sm sm:text-base text-slate-400">
            We build career intelligence with transparency, privacy, and integrity at the core.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3"
              >
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
