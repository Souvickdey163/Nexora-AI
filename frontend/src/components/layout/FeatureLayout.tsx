"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ArrowRight, ShieldCheck } from "lucide-react";

import { FeatureHero } from "./FeatureHero";

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
  featureId,
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
          hideHeaderNav ? "pt-20 sm:pt-22" : "pt-24 sm:pt-28"
        } pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8`}
      >
        {!hideHeaderNav && (
          <FeatureHero
            featureId={featureId}
            title={title}
            subtitle={subtitle}
            badge={badge}
          />
        )}

        {/* Page Content */}
        <div className="space-y-10" id="feature-workspace-content">{children}</div>

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
