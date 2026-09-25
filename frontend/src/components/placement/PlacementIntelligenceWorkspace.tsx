"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
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
  Code2,
  Video,
  FileText,
  Compass,
  Zap,
  RefreshCw,
  ShieldCheck,
  CheckSquare,
  Square,
  History,
  Layers,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import {
  placementApi,
  PlacementAssessment,
  PlacementDimension,
  PlacementRecommendation,
} from "@/lib/api/placement";
import { InsufficientCreditsModal } from "@/components/common/InsufficientCreditsModal";

const TARGET_ROLE_OPTIONS = [
  "Software Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "QA Engineer",
];

const COMPANY_CATEGORIES = [
  {
    key: "Product Technology",
    title: "Product Technology",
    desc: "Focus: DSA, System Design, and technical depth.",
  },
  {
    key: "Tier-1 Technology Startups",
    title: "Tier-1 Tech Startups",
    desc: "Focus: Practical engineering, full-stack depth, and project ownership.",
  },
  {
    key: "Global IT Services",
    title: "Global IT Services",
    desc: "Focus: Programming fundamentals, CS core, and communication.",
  },
];

export function PlacementIntelligenceWorkspace() {
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [assessment, setAssessment] = useState<PlacementAssessment | null>(null);
  const [history, setHistory] = useState<PlacementAssessment[]>([]);
  const [targetRole, setTargetRole] = useState("Software Engineer");
  const [customRole, setCustomRole] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [companyCategory, setCompanyCategory] = useState("Product Technology");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Credit modal
  const [creditModalOpen, setCreditModalOpen] = useState(false);
  const [creditError, setCreditError] = useState<{ required: number; current: number } | null>(null);

  useEffect(() => {
    loadCurrentAndHistory();
  }, []);

  const loadCurrentAndHistory = async () => {
    setLoading(true);
    setErrorMsg(null);

    const [currentRes, historyRes] = await Promise.all([
      placementApi.getCurrentAssessment(),
      placementApi.getAssessmentHistory(10),
    ]);

    if (currentRes.success && currentRes.data) {
      setAssessment(currentRes.data);
      if (currentRes.data.targetRole) {
        if (TARGET_ROLE_OPTIONS.includes(currentRes.data.targetRole)) {
          setTargetRole(currentRes.data.targetRole);
          setIsCustom(false);
        } else {
          setIsCustom(true);
          setCustomRole(currentRes.data.targetRole);
        }
      }
      if (currentRes.data.companyCategory) {
        setCompanyCategory(currentRes.data.companyCategory);
      }
    }

    if (historyRes.success && historyRes.data) {
      setHistory(historyRes.data);
    }

    setLoading(false);
  };

  const handleCalculateReadiness = async (forceRefresh: boolean = true) => {
    setCalculating(true);
    setErrorMsg(null);

    const activeRole = isCustom ? customRole.trim() || "Software Engineer" : targetRole;

    const res = await placementApi.assessReadiness(activeRole, companyCategory, forceRefresh);

    if (res.success && res.data) {
      setAssessment(res.data);
      // Refresh history list
      const hRes = await placementApi.getAssessmentHistory(10);
      if (hRes.success && hRes.data) setHistory(hRes.data);
    } else {
      if (res.code === "INSUFFICIENT_CREDITS") {
        setCreditError({
          required: res.requiredCredits || 2,
          current: res.currentCredits || 0,
        });
        setCreditModalOpen(true);
      } else {
        setErrorMsg(res.error || "Failed to calculate placement readiness.");
      }
    }

    setCalculating(false);
  };

  const handleToggleRecommendation = async (recId: string, currentStatus: boolean) => {
    if (!assessment) return;
    const newStatus = !currentStatus;

    // Optimistic UI update
    setAssessment((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        recommendations: prev.recommendations.map((r) =>
          r.id === recId ? { ...r, completed: newStatus } : r
        ),
      };
    });

    const res = await placementApi.toggleRecommendation(assessment.id, recId, newStatus);
    if (!res.success) {
      // Revert if error
      setAssessment((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          recommendations: prev.recommendations.map((r) =>
            r.id === recId ? { ...r, completed: currentStatus } : r
          ),
        };
      });
    }
  };

  const getDimensionIcon = (dimKey: string) => {
    switch (dimKey) {
      case "INTERVIEW":
        return Video;
      case "CODING":
        return Code2;
      case "RESUME":
        return FileText;
      case "ROADMAP":
        return Compass;
      default:
        return Layers;
    }
  };

  const getDimensionCta = (dimKey: string) => {
    switch (dimKey) {
      case "INTERVIEW":
        return { label: "Practice Interview", route: "/features/interview" };
      case "CODING":
        return { label: "Practice Coding", route: "/features/coding" };
      case "RESUME":
        return { label: "Optimize Resume", route: "/features/resume" };
      case "ROADMAP":
        return { label: "Continue Roadmap", route: "/features/roadmap" };
      default:
        return { label: "View Feature", route: "/features/placement" };
    }
  };

  const getEvidenceBadge = (level: string) => {
    switch (level) {
      case "STRONG":
        return <Badge variant="emerald">Strong Evidence</Badge>;
      case "MODERATE":
        return <Badge variant="sky">Moderate Evidence</Badge>;
      case "LIMITED":
        return <Badge variant="amber">Limited Evidence</Badge>;
      default:
        return <Badge variant="purple">Insufficient Data</Badge>;
    }
  };

  const getReadinessLevelColor = (level: string) => {
    switch (level) {
      case "Highly Prepared":
        return "from-indigo-500 to-purple-600 text-indigo-500 border-indigo-500/30";
      case "Strong Preparation":
        return "from-emerald-500 to-teal-600 text-emerald-500 border-emerald-500/30";
      case "Progressing":
        return "from-sky-500 to-blue-600 text-sky-500 border-sky-500/30";
      case "Developing":
        return "from-amber-500 to-orange-600 text-amber-500 border-amber-500/30";
      default:
        return "from-rose-500 to-red-600 text-rose-500 border-rose-500/30";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-24 space-y-4">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mx-auto" />
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
          Gathering Nexora activity evidence across coding, interviews, resume, and roadmap...
        </p>
      </div>
    );
  }

  const activeRoleDisplay = isCustom ? customRole || "Custom Role" : targetRole;
  const overallScore = assessment?.overallScore ?? 0;
  const readinessLevel = assessment?.readinessLevel ?? "Needs Attention";
  const evidenceCoverage = assessment?.evidenceCoverage ?? 0;
  const dimensions = assessment?.dimensions || [];
  const recommendations = assessment?.recommendations || [];

  return (
    <div className="space-y-10">
      <InsufficientCreditsModal
        isOpen={creditModalOpen}
        onClose={() => setCreditModalOpen(false)}
        requiredCredits={creditError?.required || 2}
        currentCredits={creditError?.current || 0}
      />

      {/* Target Role & Category Control Header */}
      <GlassCard className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-6 h-6 text-sky-500" />
              Target Career Configuration
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select your target role and preparation focus category to calculate your evidence-backed readiness index.
            </p>
          </div>

          <GlowButton
            onClick={() => handleCalculateReadiness(true)}
            disabled={calculating}
            className="shrink-0 flex items-center gap-2"
          >
            {calculating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing Evidence...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Calculate Readiness</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">2 Credits</span>
              </>
            )}
          </GlowButton>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Role Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-sky-500" />
              Target Role
            </label>
            <div className="flex flex-wrap gap-2">
              {TARGET_ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setIsCustom(false);
                    setTargetRole(role);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    !isCustom && targetRole === role
                      ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {role}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCustom(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isCustom
                    ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                + Custom Role
              </button>
            </div>
            {isCustom && (
              <input
                type="text"
                placeholder="Enter custom target role (e.g. Solutions Architect)..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full mt-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            )}
          </div>

          {/* Company Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-500" />
              Company Preparation Category
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {COMPANY_CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setCompanyCategory(cat.key)}
                  className={`p-3 rounded-2xl text-left border transition-all space-y-1 ${
                    companyCategory === cat.key
                      ? "bg-indigo-500/10 border-indigo-500 text-slate-900 dark:text-white shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                    <span>{cat.title}</span>
                    {companyCategory === cat.key && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{cat.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>

      {!assessment ? (
        /* Empty Onboarding State */
        <GlassCard className="text-center py-16 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center mx-auto">
            <Target className="w-8 h-8" />
          </div>
          <div className="max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Calculate Your Placement Readiness Index
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Nexora evaluates your actual coding submissions, mock interview scores, resume ATS analyses, and career roadmap progress to calculate an objective, explainable preparation score.
            </p>
          </div>

          <div className="pt-2">
            <GlowButton
              onClick={() => handleCalculateReadiness(true)}
              disabled={calculating}
              className="mx-auto flex items-center gap-2"
            >
              {calculating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Your Data...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Readiness Index</span>
                </>
              )}
            </GlowButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800">
            <Link href="/features/resume" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 border border-transparent transition-all text-left space-y-1 group">
              <FileText className="w-5 h-5 text-sky-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">1. Upload Resume</h4>
              <p className="text-[11px] text-slate-500">Run ATS analysis for target role</p>
            </Link>
            <Link href="/features/coding" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 border border-transparent transition-all text-left space-y-1 group">
              <Code2 className="w-5 h-5 text-emerald-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">2. Practice Coding</h4>
              <p className="text-[11px] text-slate-500">Solve DSA problems in Coding Arena</p>
            </Link>
            <Link href="/features/interview" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 border border-transparent transition-all text-left space-y-1 group">
              <Video className="w-5 h-5 text-amber-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">3. Complete Mock Interview</h4>
              <p className="text-[11px] text-slate-500">Test technical & verbal clarity</p>
            </Link>
            <Link href="/features/roadmap" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:border-sky-500/50 border border-transparent transition-all text-left space-y-1 group">
              <Compass className="w-5 h-5 text-indigo-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">4. Generate Roadmap</h4>
              <p className="text-[11px] text-slate-500">Track structured milestone goals</p>
            </Link>
          </div>
        </GlassCard>
      ) : (
        <>
          {/* Hero Readiness Overview Card */}
          <GlassCard className="relative overflow-hidden space-y-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Left: Circular Radial Visualization & Readiness Level */}
              <div className="flex items-center gap-6">
                <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-slate-200 dark:stroke-slate-800"
                      strokeWidth="10"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-sky-500 transition-all duration-1000 ease-out"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * overallScore) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                      {overallScore}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Out of 100
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Readiness Index
                    </span>
                    <Badge variant="sky">{evidenceCoverage}% Coverage</Badge>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {readinessLevel}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
                    Evaluated for <strong className="text-slate-900 dark:text-white">{activeRoleDisplay}</strong> targeting{" "}
                    <strong className="text-indigo-500">{companyCategory}</strong> companies.
                  </p>
                </div>
              </div>

              {/* Right: Quick Dimension Stats Pill Badges */}
              <div className="w-full lg:w-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3">
                {dimensions.map((dim) => (
                  <div
                    key={dim.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      <span>{dim.dimension}</span>
                      <span className="text-slate-900 dark:text-white font-extrabold">
                        {dim.score !== null ? `${dim.score}%` : "N/A"}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-sky-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${dim.score ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Disclaimer Banner */}
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white font-bold">Evidence-Driven Preparation Indicator:</strong>{" "}
                This index reflects preparation evidence currently available in your Nexora activity records. It measures preparation depth and does NOT predict or guarantee hiring outcomes.
              </div>
            </div>
          </GlassCard>

          {/* Readiness Dimensions Grid (4 Primary Cards) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-sky-500" />
                Readiness Dimensions Breakdown
              </h3>
              <span className="text-xs text-slate-500 font-medium">Weighted internal model</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dimensions.map((dim) => {
                const IconComp = getDimensionIcon(dim.dimension);
                const cta = getDimensionCta(dim.dimension);

                return (
                  <GlassCard key={dim.id} className="space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                              {dim.dimension.charAt(0) + dim.dimension.slice(1).toLowerCase()}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-semibold">{dim.source}</span>
                          </div>
                        </div>
                        {getEvidenceBadge(dim.evidenceLevel)}
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-semibold text-slate-500">Score</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {dim.score !== null ? `${dim.score}/100` : "N/A"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {dim.explanation}
                      </p>

                      {dim.evidenceDetails && dim.evidenceDetails.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Verified Signals
                          </span>
                          <ul className="space-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {dim.evidenceDetails.map((detail, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <span className="w-1 h-1 rounded-full bg-sky-500 shrink-0" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                      <Link
                        href={cta.route}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all"
                      >
                        <span>{cta.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>

          {/* AI Explanation & Guidance Card */}
          <GlassCard className="space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  AI Evidence Explanation & Guidance
                </h3>
                <p className="text-xs text-slate-500">Generated by Nexus AI based on pre-calculated logic</p>
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {assessment.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Strengths */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Strengths
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {assessment.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Priority Areas */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  Priority Improvement Areas
                </h4>
                <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  {assessment.priorityAreas.map((pa, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{pa}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Recommended Action Plan List */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              Recommended Preparation Action Plan
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <GlassCard key={rec.id} className="flex items-start justify-between gap-4 p-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleRecommendation(rec.id, rec.completed)}
                        className="text-slate-400 hover:text-sky-500 transition-colors"
                      >
                        {rec.completed ? (
                          <CheckSquare className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                      <Badge variant={rec.priority === "HIGH" ? "rose" : rec.priority === "MEDIUM" ? "amber" : "sky"}>
                        {rec.priority} Priority
                      </Badge>
                    </div>

                    <h4
                      className={`text-xs font-extrabold ${
                        rec.completed
                          ? "line-through text-slate-400 dark:text-slate-500"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {rec.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                      {rec.description}
                    </p>
                  </div>

                  <Link
                    href={rec.route || "/features/placement"}
                    className="p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-500 hover:text-white transition-all shrink-0 mt-1"
                    title="Execute action"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Historical Assessment Comparison Trend */}
          {history.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-slate-500" />
                Assessment History & Preparation Trend
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Target Role</th>
                      <th className="pb-3">Category</th>
                      <th className="pb-3">Coverage</th>
                      <th className="pb-3">Readiness Level</th>
                      <th className="pb-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {history.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 text-slate-500 font-medium">
                          {new Date(h.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 font-bold text-slate-900 dark:text-white">{h.targetRole}</td>
                        <td className="py-3 text-slate-500">{h.companyCategory}</td>
                        <td className="py-3 text-slate-500">{h.evidenceCoverage}%</td>
                        <td className="py-3 font-semibold text-sky-500">{h.readinessLevel}</td>
                        <td className="py-3 text-right font-black text-slate-900 dark:text-white text-sm">
                          {h.overallScore}/100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
