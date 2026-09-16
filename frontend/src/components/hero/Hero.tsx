"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Compass } from "lucide-react";
import { HeroImageCarousel } from "./HeroImageCarousel";
import { CompanyMarquee } from "../sections/CompanyMarquee";

export function Hero() {
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
      {/* Subtle Background Glow Accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[480px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-cyan-400/5 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Main Two-Column Hero Container — Exact Same max-w-7xl as Navbar & Lower Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT SIDE — Content & Telemetry Stats (6 cols out of 12) */}
          <div className="lg:col-span-6 w-full min-w-0 space-y-6 text-center lg:text-left">
            
            {/* Trust Statement Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm">
              <div className="w-5 h-5 rounded-md bg-white dark:bg-slate-900 p-0.5 flex items-center justify-center border border-slate-200 dark:border-sky-500/30">
                <Image
                  src="/logo-nexora.png"
                  alt="Nexora AI Logo"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
              <span>Built for students, developers, and future engineers.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Your AI Career{" "}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Copilot.
              </span>
            </h1>

            {/* Supporting Subheading */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 tracking-tight">
              Prepare smarter. Build stronger. Get career-ready.
            </p>

            {/* Platform Feature Scope Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              One intelligent platform for resumes, interviews, coding, GitHub analysis, career guidance, and placement preparation.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-1">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-base shadow-lg shadow-sky-500/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <span>Start Your Career Journey</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-200/80 dark:border-slate-800 transition-all duration-200 focus:outline-none"
              >
                <Compass className="w-4 h-4 text-sky-500" />
                <span>Explore Features</span>
              </a>
            </div>

            {/* BOTTOM REPUTATION & PLATFORM IMPACT BLOCK */}
            <div className="pt-3 flex flex-col sm:flex-row items-center lg:items-start gap-5">
              {/* Stats Box */}
              <div className="w-full sm:w-auto flex-1 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/90 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 pb-2.5 border-b border-slate-200/60 dark:border-slate-800/60">
                  <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
                  <span>Platform Placement Impact</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2.5 text-center sm:text-left">
                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      98%
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      ATS Success Rate
                    </div>
                  </div>

                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      10K+
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      Mock Rounds
                    </div>
                  </div>

                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      20+
                    </div>
                    <div className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      Top Tech Hiring
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle Decorative Lines */}
              <div className="hidden sm:flex flex-col gap-1.5 opacity-30 pt-3">
                <div className="w-14 h-[2px] bg-slate-400 dark:bg-slate-600" />
                <div className="w-10 h-[2px] bg-slate-400 dark:bg-slate-600" />
                <div className="w-6 h-[2px] bg-slate-400 dark:bg-slate-600" />
              </div>
            </div>

          </div>

          {/* RIGHT SIDE — Widescreen Side-by-Side Showcase (6 cols out of 12) */}
          <div className="lg:col-span-6 w-full min-w-0 pt-2 lg:pt-0">
            <HeroImageCarousel />
          </div>

        </div>
      </div>

      {/* 22+ Top Tech Companies Infinite Sliding Marquee */}
      <div className="mt-14 md:mt-20">
        <CompanyMarquee />
      </div>
    </section>
  );
}
