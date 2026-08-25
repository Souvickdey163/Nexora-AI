"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { GithubIcon } from "@/components/common/GithubIcon";
import {
  Search,
  Star,
  GitFork,
  GitCommit,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  CheckCircle2,
} from "lucide-react";

export function GithubIntelligenceWorkspace() {
  const [repoUrl, setRepoUrl] = useState("github.com/Souvickdey163/Nexora");
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 1000);
  };

  return (
    <div className="space-y-8">
      {/* Search Input Banner */}
      <GlassCard className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
            <GithubIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Analyze Public GitHub Repository
            </h3>
            <p className="text-xs text-slate-500">
              Evaluate code quality, architecture depth, test coverage, and documentation impact.
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="e.g. github.com/username/repository"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <GlowButton type="submit" loading={analyzing} icon={Sparkles}>
            Analyze Repo
          </GlowButton>
        </form>
      </GlassCard>

      {/* Top Repository Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Stars" value="142" change="+18 this week" trend="up" icon={Star} />
        <StatCard title="Forks" value="38" change="+5" trend="up" icon={GitFork} />
        <StatCard title="Commits" value="284" change="Active" trend="up" icon={GitCommit} />
        <StatCard title="Contributors" value="4" change="Team" trend="neutral" icon={Users} />
      </div>

      {/* 2-Column Overview & Score Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Health Scores & Architecture */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="text-center space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Repository Architecture Score
              </span>
              <Badge variant="emerald">Top 5% Portfolio</Badge>
            </div>

            <div className="flex justify-center py-2">
              <ProgressRing progress={94} size={140} label="94%" sublabel="Repo Health" color="emerald" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-left">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                <span className="text-slate-500">Code Quality:</span>
                <p className="font-bold text-sky-500">96/100 (Modular TS)</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                <span className="text-slate-500">Documentation:</span>
                <p className="font-bold text-emerald-500">92/100 (Complete)</p>
              </div>
            </div>
          </GlassCard>

          {/* Languages Distribution */}
          <GlassCard className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Languages & Tech Stack
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>TypeScript</span>
                <span className="text-sky-500">74.2%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full w-[74.2%]" />
              </div>

              <div className="flex justify-between text-xs font-semibold">
                <span>CSS / Tailwind</span>
                <span className="text-indigo-500">18.5%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[18.5%]" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Detailed Quality & Security Findings */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="space-y-4">
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Technical Depth & Security Findings
            </h4>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Zero Hardcoded Secrets Detected
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500">PASSED</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  All API keys, database URLs, and JWT secrets are cleanly managed via environment variables (`.env`).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Strict TypeScript Configuration
                  </span>
                  <span className="text-[10px] font-mono text-sky-500">PASSED</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Strict type checking enabled in `tsconfig.json` with zero implicit any types.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Recommendation: Add Automated CI/CD Workflow
                  </span>
                  <span className="text-[10px] font-mono text-amber-500">SUGGESTION</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  Add GitHub Actions `.github/workflows/ci.yml` for automated testing on every pull request.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
