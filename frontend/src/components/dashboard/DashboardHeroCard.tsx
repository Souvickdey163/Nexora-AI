"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Globe,
  Video,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  PlusCircle,
  Briefcase,
  Users,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export function DashboardHeroCard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"materials" | "jobs" | "networking" | "interviews">("materials");
  const [activeStep, setActiveStep] = useState(0);

  const STEPS = [
    {
      id: "resume",
      title: "Create A Base Resume",
      icon: FileText,
      tag: "Resume & Profile",
      headline: "Create or optimize your resume to get started",
      description: "Generate a comprehensive ATS-optimized master resume. Automatically calculate score gaps and tailor your application to any tech position.",
      ctaText: "Create & Analyze Base Resume",
      href: "/resume",
    },
    {
      id: "linkedin",
      title: "Optimize Professional Profile",
      icon: Globe,
      tag: "Social Presence",
      headline: "Upgrade your professional headline & recruiter visibility",
      description: "Align your profile summary and skill endorsements to rank 4x higher in recruiter candidate searches.",
      ctaText: "Run Profile Audit",
      href: "/resume#linkedin",
    },
    {
      id: "mock",
      title: "Complete AI Mock Interview",
      icon: Video,
      tag: "Interview Prep",
      headline: "Simulate a live 15-minute AI technical interview round",
      description: "Test your STAR method audio responses with instant AI score feedback before real recruiter phone screens.",
      ctaText: "Start AI Mock Interview",
      href: "/interview",
    },
  ];

  const currentStep = STEPS[activeStep];
  const StepIcon = currentStep.icon;

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="text-center space-y-1">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Hi, {user?.firstName || "Candidate"} 👋
        </h2>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
          Here&apos;s an impactful action plan for your dream job hunt
        </p>
      </div>

      {/* Milestone Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {[
          { id: "materials", label: "Application Materials" },
          { id: "jobs", label: "Jobs" },
          { id: "networking", label: "Networking" },
          { id: "interviews", label: "Interviews" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105"
                : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Two-Column Action Progress Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column Steps List */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900 text-white border border-slate-800 p-6 flex flex-col justify-between space-y-6 shadow-xl">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Progress
              </span>
              <span className="text-xs font-extrabold text-sky-400">
                {activeStep + 1} / {STEPS.length}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>

            {/* Steps Checklist Items */}
            <div className="space-y-2 pt-2">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isSelected = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    className={`w-full p-3.5 rounded-2xl transition-all flex items-center justify-between gap-3 text-left ${
                      isSelected
                        ? "bg-slate-800 border-2 border-sky-500 text-white shadow-md"
                        : "bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-sky-500 text-white" : "bg-slate-800 text-slate-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold truncate">{step.title}</span>
                    </div>

                    {isSelected && <div className="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2 border-t border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Nexora AI automatically syncs your progress telemetry.</span>
          </div>

        </div>

        {/* Right Column Action Card Showcase */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl">
          
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 blur-[90px] rounded-full pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            <div className="md:col-span-7 space-y-4">
              <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                {currentStep.tag}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                {currentStep.headline}
              </h3>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentStep.description}
              </p>

              <div className="pt-2">
                <Link
                  href={currentStep.href}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/20 transition-all"
                >
                  <StepIcon className="w-4 h-4" />
                  <span>{currentStep.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* 3D Card Visual */}
            <div className="md:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[240px] p-5 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-2xl space-y-3 transform rotate-2 hover:rotate-0 transition-transform">
                <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-white">David Baker</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-extrabold">88 ATS</span>
                </div>

                <div className="space-y-1.5">
                  <div className="h-1.5 bg-slate-700 rounded-full w-3/4" />
                  <div className="h-1.5 bg-slate-700/60 rounded-full w-full" />
                  <div className="h-1.5 bg-slate-700/60 rounded-full w-5/6" />
                </div>

                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60 text-[10px] text-sky-400 flex items-center justify-between">
                  <span>ATS Keywords</span>
                  <span className="font-bold text-white">+14 Matches</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
