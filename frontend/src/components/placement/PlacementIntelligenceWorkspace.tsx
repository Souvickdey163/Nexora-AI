"use client";

import React, { useState, useEffect } from "react";
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
  Target,
  Briefcase,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { placementApi, PlacementReadinessResponse } from "@/lib/api/placement";
import Link from "next/link";

export function PlacementIntelligenceWorkspace() {
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState<PlacementReadinessResponse['readiness'] | null>(null);

  useEffect(() => {
    const fetchReadiness = async () => {
      setLoading(true);
      const res = await placementApi.getReadiness();
      if (res.success && res.readiness) {
        setReadiness(res.readiness);
      }
      setLoading(false);
    };
    fetchReadiness();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
        <p className="text-xs font-medium text-slate-400">Analyzing placement readiness dimensions...</p>
      </div>
    );
  }

  const overallScore = readiness?.overallScore || 0;
  const tier = readiness?.readinessTier || "Developing";
  const dimensions = readiness?.dimensions || [];
  const strengths = readiness?.strengths || [];
  const skillGaps = readiness?.skillGaps || [];
  const nextActionableSteps = readiness?.nextActionableSteps || [];

  return (
    <div className="space-y-8">
      {/* Top Placement Overview Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Placement Score" value={`${overallScore}%`} change={tier} trend="up" icon={Target} />
        <StatCard title="Target Role" value={readiness?.targetRole || "Software Engineer"} badge="Primary" icon={Briefcase} />
        <StatCard title="Readiness Tier" value={tier} badge="Verified" icon={CheckCircle2} />
        <StatCard title="Verified Dimensions" value={`${dimensions.length} Evaluated`} badge="Real-time" icon={TrendingUp} />
      </div>

      {/* Main Readiness Dimensions Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-500" />
            Explainable Placement Readiness Dimensions
          </h3>
          <span className="text-xs text-slate-500">Evaluated from your actual platform activity</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dimensions.map((dim, idx) => (
            <GlassCard key={idx} className="space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                      {dim.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">Weight: {dim.weight}</p>
                  </div>
                  <Badge variant={dim.score >= 75 ? "emerald" : dim.score >= 50 ? "sky" : "amber"}>
                    {dim.score}%
                  </Badge>
                </div>

                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Status:</span>
                  <p className="text-slate-500">{dim.status}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-sky-500">Recommendation:</span> {dim.recommendation}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Strengths & Action Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="space-y-4">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            Verified Career Strengths
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="space-y-4">
          <h4 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Priority Skill Action Plan
          </h4>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {nextActionableSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
