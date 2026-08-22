"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FEATURES } from "@/data/features";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export function FeatureShowcase() {
  const showcaseFeatures = FEATURES.slice(0, 8);

  return (
    <section id="features" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-36">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Deep Feature Breakdown</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Engineered to Solve Real Placement Challenges.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Every module provides actionable feedback to elevate your resume, code quality, interview performance, and GitHub profile.
          </p>
        </div>

        {/* Feature Grid with Alternating Layouts */}
        <div className="space-y-20 md:space-y-32">
          {showcaseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={feature.id}
                className={`flex flex-col gap-10 lg:gap-16 items-center ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                {/* Content Column */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50 text-xs font-semibold text-sky-600 dark:text-sky-400">
                    <Icon className="w-3.5 h-3.5" />
                    <span>{feature.category}</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.longDescription}
                  </p>

                  <ul className="space-y-3 pt-2">
                    {feature.benefits.map((benefit, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4">
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:opacity-90 transition-opacity focus:outline-none"
                    >
                      <span>Explore {feature.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Visual Preview Column */}
                <div className="w-full lg:w-1/2">
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-900 shadow-xl group">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-300" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
