"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { FEATURES } from "@/data/features";
import { Sparkles, ArrowRight, ShieldCheck, Info } from "lucide-react";

interface FeatureLayoutProps {
  children: React.ReactNode;
  featureId: string;
  title: string;
  subtitle: string;
  category?: string;
  badge?: string;
}

export function FeatureLayout({
  children,
  featureId,
  title,
  subtitle,
  category = "Career Intelligence",
  badge,
}: FeatureLayoutProps) {
  const pathname = usePathname();
  const currentFeature = FEATURES.find((f) => f.id === featureId);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white transition-colors duration-300 relative overflow-hidden">
      {/* Background Orbs & Grids */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-sky-500/10 dark:bg-sky-500/15 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/15 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Shared Navbar */}
      <Navbar />

      {/* Main Feature Content Container */}
      <main className="flex-1 pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Breadcrumb & Header Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-sky-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-sky-600 dark:text-sky-400 font-bold uppercase tracking-wider text-[11px]">
              {category}
            </span>
            <span>/</span>
            <span className="text-slate-900 dark:text-white">{title}</span>
          </div>

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

            {/* Quick Link to Unified Dashboard */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-md"
            >
              <span>Unified Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Feature Quick Switcher Navigation Bar */}
        <div className="overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center gap-2 min-w-max p-1 bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl backdrop-blur-md">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              const isActive = pathname === feature.href;
              return (
                <Link
                  key={feature.id}
                  href={feature.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{feature.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

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
