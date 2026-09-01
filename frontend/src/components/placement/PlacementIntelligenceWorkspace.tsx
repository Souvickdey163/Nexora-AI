"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Target,
  ArrowRight,
  Briefcase,
} from "lucide-react";

interface CompanyMatch {
  name: string;
  role: string;
  compatibility: number;
  strengths: string[];
  missingSkills: string[];
  recommendedAction: string;
}

const COMPANY_MATCHES: CompanyMatch[] = [
  {
    name: "Google",
    role: "Senior Software Engineer (L5)",
    compatibility: 89,
    strengths: ["DSA Two-Pointer & DP", "System Architecture", "TypeScript/Node.js"],
    missingSkills: ["Distributed Locking (Redlock)", "Large-Scale Graph Algorithms"],
    recommendedAction: "Complete 2 Graph & System Design mock sessions.",
  },
  {
    name: "Amazon",
    role: "Software Development Engineer II (SDE-II)",
    compatibility: 94,
    strengths: ["Object-Oriented Design", "Leadership Principles", "PostgreSQL & Prisma"],
    missingSkills: ["AWS DynamoDB Single Table Design"],
    recommendedAction: "Review DynamoDB indexing patterns before technical rounds.",
  },
  {
    name: "Microsoft",
    role: "Software Engineer II",
    compatibility: 91,
    strengths: ["React / Next.js Architecture", "Async Event Processing", "CI/CD"],
    missingSkills: ["Azure Kubernetes Service (AKS)"],
    recommendedAction: "Read Azure container deployment guide.",
  },
];

export function PlacementIntelligenceWorkspace() {
  return (
    <div className="space-y-8">
      {/* Top Placement Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Overall Readiness" value="89%" change="+6%" trend="up" icon={Target} />
        <StatCard title="Target Role" value="Full Stack Lead" badge="Tier-1" icon={Briefcase} />
        <StatCard title="Interview Preparedness" value="88%" change="+5%" trend="up" icon={CheckCircle2} />
        <StatCard title="Placement Forecast" value="Very High" badge="Estimated" icon={TrendingUp} />
      </div>

      {/* Main Company Match Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-500" />
            Target Company Compatibility Indicators
          </h3>
          <span className="text-xs text-slate-500">Based on your current Nexora profile data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPANY_MATCHES.map((company, idx) => (
            <GlassCard key={idx} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {company.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">{company.role}</p>
                  </div>
                  <Badge variant={company.compatibility >= 90 ? "emerald" : "sky"}>
                    {company.compatibility}% Match
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Key Compatibility Strengths:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {company.strengths.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Target Skill Gaps:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300">
                    {company.missingSkills.map((m, i) => (
                      <li key={i}>• {m}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-sky-500">Recommended Action:</span> {company.recommendedAction}
                </div>
                <GlowButton size="sm" fullWidth icon={ArrowRight}>
                  View {company.name} Prep Guide
                </GlowButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
