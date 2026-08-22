"use client";

import React from "react";
import dynamic from "next/dynamic";
import { SceneFallback } from "../3d/SceneFallback";
import { Sparkles } from "lucide-react";

const CareerJourney3D = dynamic(
  () => import("../3d/CareerJourney3D").then((mod) => mod.CareerJourney3D),
  {
    ssr: false,
    loading: () => <SceneFallback />,
  }
);

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 4-Step Process</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Nexora Transforms Your Career Preparation.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            From raw project repositories to targeted interview offers — see how your career data evolves into a personalized roadmap.
          </p>
        </div>

        {/* 3D Visual Journey Canvas with dynamic loading */}
        <CareerJourney3D />
      </div>
    </section>
  );
}
