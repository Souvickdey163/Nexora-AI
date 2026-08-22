"use client";

import React from "react";
import { UserCheck, Search, MapPin, TrendingUp } from "lucide-react";

export interface StepItem {
  number: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STEPS: StepItem[] = [
  {
    number: "STEP 01",
    title: "Build Your Profile",
    description: "User adds resume, key skills, GitHub profile, and target career goals.",
    icon: UserCheck,
  },
  {
    number: "STEP 02",
    title: "Understand Your Skills",
    description: "The platform analyzes resume, coding abilities, interviews, GitHub projects, and skill gaps.",
    icon: Search,
  },
  {
    number: "STEP 03",
    title: "Get Your Career Plan",
    description: "The platform generates personalized AI recommendations and a step-by-step career roadmap.",
    icon: MapPin,
  },
  {
    number: "STEP 04",
    title: "Track Your Growth",
    description: "Users track weekly progress, benchmark readiness, and continuously improve career skills.",
    icon: TrendingUp,
  },
];

export function SceneFallback() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        return (
          <div
            key={step.number}
            className="relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest text-sky-600 dark:text-sky-400">
                  {step.number}
                </span>
                <div className="p-2.5 rounded-xl bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-400 dark:text-slate-600">
                &rarr;
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
