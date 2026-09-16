"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden bg-slate-900 text-white">
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-cyan-400/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="p-8 md:p-14 rounded-3xl bg-slate-950/80 border border-slate-800 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold uppercase tracking-wider border border-sky-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Begin Your Transformation</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto">
            Ready to build your career with clarity?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
            Turn your skills, projects, and preparation into a smarter career journey.
          </p>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white text-slate-900 font-bold text-base shadow-xl hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <span>Start Your Career Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
