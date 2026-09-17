"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface FeatureLayoutProps {
  children: React.ReactNode;
  featureId: string;
  title: string;
  subtitle: string;
  category?: string;
  badge?: string;
  hideHeaderNav?: boolean;
}

export function FeatureLayout({
  children,
  title,
  subtitle,
  badge,
  hideHeaderNav = false,
}: FeatureLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Background Orbs & Grids */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Shared Navbar */}
      <Navbar />

      {/* Main Feature Content Container */}
      <main
        className={`flex-1 ${
          hideHeaderNav ? "pt-20 sm:pt-22" : "pt-28"
        } pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8`}
      >
        {!hideHeaderNav && (
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center justify-center sm:justify-start gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {title}
                  </h1>
                  {badge && (
                    <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300 border border-sky-500/20">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Quick Link to Home */}
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-md"
              >
                <span>Unified Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="space-y-10">{children}</div>

        {/* Responsible AI Disclaimer Callout */}
        <div className="p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-400/5 border border-sky-500/20 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-slate-900 dark:text-slate-200">
              Responsible Career AI Notice
            </span>
            <p className="leading-relaxed">
              Nexora AI insights, ATS scoring algorithms, readiness indicators, and interview evaluations are advisory recommendations designed to enhance candidate preparation. Outcomes reflect target role alignment and skill development.
            </p>
          </div>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
