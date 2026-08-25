"use client";

import React from "react";
import { Sparkles, FileText, CheckCircle2, ArrowRight, UploadCloud, Eye } from "lucide-react";

interface ResumeHeroProps {
  onUploadClick: () => void;
  onSampleClick: () => void;
}

export function ResumeHero({ onUploadClick, onSampleClick }: ResumeHeroProps) {
  return (
    <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-sky-500/15 via-indigo-500/10 to-cyan-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI-Powered ATS Optimization & Scoring</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              AI Resume{" "}
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-slate-700 dark:text-slate-200 tracking-tight">
              Turn your resume into a stronger, ATS-ready profile.
            </p>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Upload your resume for real-time ATS compatibility scoring, keyword gap detection, bullet-point impact rewrites, and job-description matching engineered for tech roles.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onUploadClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-base shadow-lg shadow-sky-500/10 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <UploadCloud className="w-5 h-5 text-sky-400 dark:text-sky-600" />
                <span>Analyze My Resume</span>
              </button>

              <button
                onClick={onSampleClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200 font-semibold text-base border border-slate-200/80 dark:border-slate-800 transition-all duration-200 focus:outline-none"
              >
                <Eye className="w-4 h-4 text-sky-500" />
                <span>View Sample Analysis</span>
              </button>
            </div>

            {/* Key Value Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400 pt-3">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Real-time ATS Compatibility
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Action-Verb Rewriter
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Private & Secure Processing
              </span>
            </div>
          </div>

          {/* Right Column 3D Document Visual */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md perspective-1000">
              
              {/* Floating 3D Resume Glass Card */}
              <div className="relative rounded-2xl p-6 bg-white/80 dark:bg-slate-900/90 border border-slate-200/90 dark:border-sky-500/30 shadow-2xl shadow-sky-500/10 backdrop-blur-xl transform rotate-1 hover:rotate-0 transition-transform duration-500 space-y-4">
                
                {/* Header Badge inside card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Alex Morgan</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Senior Full-Stack Engineer</p>
                    </div>
                  </div>
                  
                  {/* Floating 3D ATS Score Badge */}
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm shadow-sm flex items-center gap-1">
                    <span>88</span>
                    <span className="text-[10px] text-emerald-500 font-medium">/100</span>
                  </div>
                </div>

                {/* Content Simulation Lines */}
                <div className="space-y-2">
                  <div className="h-2 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/60 rounded-full" />
                  <div className="h-2 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded-full" />
                </div>

                {/* Skill badges visual */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    React.js
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    TypeScript
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    Node.js
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-[11px] font-medium">
                    +4 Missing Keywords
                  </span>
                </div>

                {/* Sub Card - AI Suggestion Floating Pill */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800 text-xs flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">ATS Formatting Health</span>
                  <span className="font-semibold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passed 14 Checks
                  </span>
                </div>

              </div>

              {/* Decorative Secondary Backdrop Card */}
              <div className="absolute -bottom-4 -right-4 w-full h-full rounded-2xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/20 -z-10 blur-[1px] transform rotate-3" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
