"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatCard } from "@/components/ui/StatCard";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Badge } from "@/components/ui/Badge";
import { GlowButton } from "@/components/ui/GlowButton";
import {
  TrendingUp,
  Sparkles,
  BarChart3,
  Loader2,
  ArrowRight,
  Code2,
  Video,
  FileText,
} from "lucide-react";
import { analyticsApi } from "@/lib/api/analytics";
import Link from "next/link";

export function CareerAnalyticsWorkspace() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const res = await analyticsApi.getDashboardAnalytics();
      if (res.success && res.analytics) {
        setData(res.analytics);
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
        <p className="text-xs font-medium text-slate-400">Loading your real career analytics...</p>
      </div>
    );
  }

  const hasData = data?.hasData || false;
  const avgInterview = data?.avgInterviewScore || 0;
  const avgResume = data?.avgResumeScore || 0;
  const codingSolved = data?.totalCodingSolved || 0;
  const totalInterviews = data?.totalInterviews || 0;

  // Real composite readiness score calculation
  const compositeScore = Math.round(
    (avgInterview * 0.4) + (avgResume * 0.3) + (Math.min(100, codingSolved * 20) * 0.3)
  );

  return (
    <div className="space-y-8">
      {/* Top KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard title="Interview Avg" value={avgInterview > 0 ? `${avgInterview}%` : "N/A"} trend="up" />
        <StatCard title="Resume Avg" value={avgResume > 0 ? `${avgResume}%` : "N/A"} trend="up" />
        <StatCard title="Coding Solved" value={`${codingSolved} Problems`} trend="up" />
        <StatCard title="Mock Sessions" value={`${totalInterviews} Conducted`} trend="up" />
      </div>

      {!hasData ? (
        <GlassCard className="text-center py-16 px-6 space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto">
            <BarChart3 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Not Enough Activity Data Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Your career analytics update in real-time as you solve coding challenges, upload resumes for AI feedback, and take mock interview sessions.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/features/coding">
              <GlowButton icon={Code2} size="sm">
                Solve Coding Challenge
              </GlowButton>
            </Link>
            <Link href="/features/interview">
              <GlowButton icon={Video} variant="outline" size="sm">
                Mock Interview
              </GlowButton>
            </Link>
            <Link href="/features/resume">
              <GlowButton icon={FileText} variant="outline" size="sm">
                Scan Resume
              </GlowButton>
            </Link>
          </div>
        </GlassCard>
      ) : (
        /* Main Analytics Charts & Progress */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Score Trend */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Interview Performance Trend
                  </h3>
                  <p className="text-xs text-slate-500">Recorded scores across your AI mock interview sessions.</p>
                </div>
                <Badge variant="emerald" icon={TrendingUp}>
                  Active Data
                </Badge>
              </div>

              {data.interviewScoreTrend?.length > 0 ? (
                <div className="h-56 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-200 dark:border-slate-800">
                  {data.interviewScoreTrend.map((item: any, idx: number) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.score}%
                      </span>
                      <div
                        style={{ height: `${Math.max(15, item.score)}%` }}
                        className="w-full max-w-[40px] bg-gradient-to-t from-sky-500 to-indigo-600 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      />
                      <span className="text-[10px] font-bold text-slate-500">{item.date}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-8 text-center">No interview sessions recorded yet.</p>
              )}
            </GlassCard>
          </div>

          {/* RIGHT COLUMN: Composite Index */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="text-center space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Overall Career Score Index
              </h4>
              <div className="flex justify-center py-2">
                <ProgressRing progress={compositeScore} size={150} label={`${compositeScore}%`} sublabel="Readiness" color="sky" />
              </div>

              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
                <span className="font-bold text-sky-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommended Next Step:
                </span>
                <p>Keep taking coding arena challenges and mock interviews to increase your score index!</p>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
}
