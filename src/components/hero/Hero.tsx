"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Compass, ShieldCheck } from "lucide-react";
import { ProductCarousel } from "./ProductCarousel";
import { CompanyMarquee } from "../sections/CompanyMarquee";

export function Hero() {
  return (
    <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 overflow-hidden">
      {/* Subtle Background Glow Accent (No excessive neon/cyberpunk) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-sky-500/10 via-indigo-500/10 to-cyan-400/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Header Text */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
        {/* Trust / Product Statement Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm backdrop-blur-sm">
          <div className="w-5 h-5 rounded-md bg-slate-900 dark:bg-sky-950 p-0.5 flex items-center justify-center border border-sky-500/30">
            <Image
              src="/logo-transparent.png"
              alt="Nexora AI Logo"
              width={16}
              height={16}
              className="w-full h-full object-contain"
            />
          </div>
          <span>Built for students, developers, and future engineers.</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Your AI Career <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">Copilot.</span>
        </h1>

        {/* Alternative Supporting Line */}
        <p className="text-lg sm:text-2xl font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
          Prepare smarter. Build stronger. Get career-ready.
        </p>

        {/* Description */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          One intelligent platform for resumes, interviews, coding, GitHub analysis, career guidance, and placement preparation.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-base shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
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
      </div>

      {/* Full-Width Edge-to-Edge Product Showcase */}
      <div className="mt-12 md:mt-16 w-full px-2 sm:px-4 md:px-8 max-w-[1600px] mx-auto">
        <ProductCarousel />
      </div>

      {/* 22+ Top Tech Companies Infinite Sliding Marquee */}
      <div className="mt-14 md:mt-20">
        <CompanyMarquee />
      </div>ʼ
    </section>
  );
}
