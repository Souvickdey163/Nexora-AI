"use client";

import React, { useState } from "react";
import { ResumeHero } from "./ResumeHero";
import { ResumeUploader } from "./ResumeUploader";
import { AtsScoreCard, AtsScoreData } from "./AtsScoreCard";
import { SkillExtractionGrid, SkillCategory, MissingSkill } from "./SkillExtractionGrid";
import { SectionAnalysisCards, SectionDetail } from "./SectionAnalysisCards";
import { AiSectionRewriter } from "./AiSectionRewriter";
import { JobDescriptionMatcher } from "./JobDescriptionMatcher";
import { AiFeedbackPanel, FeedbackItem } from "./AiFeedbackPanel";
import { ResumeComparisonView } from "./ResumeComparisonView";
import { ResumeActionPlan } from "./ResumeActionPlan";
import { ResumeVersionHistory } from "./ResumeVersionHistory";
import { Sparkles, BarChart3, Layers, Briefcase, FileCheck, CheckCircle2, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { resumeApi } from "@/lib/api/resume";

export function ResumePageClient() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing ATS Parser...");
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "skills" | "jd" | "action" | "history">("overview");
  const [activeRewriterSection, setActiveRewriterSection] = useState<SectionDetail | null>(null);

  // Real Dynamic API State
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<any | null>(null);
  const [targetRole, setTargetRole] = useState("Full-Stack Engineer");
  const [apiError, setApiError] = useState<string | null>(null);

  const handleStartAnalysis = async (fileObj: { name: string; size: number; type: string; file?: File }, role: string) => {
    setIsAnalyzing(true);
    setApiError(null);
    setProgress(15);
    setCurrentStep("Uploading PDF document to secure storage...");
    setTargetRole(role);

    // CLEAR PREVIOUS RESUME ANALYSIS RESULTS BEFORE NEW UPLOAD
    setHasAnalyzed(false);
    setCurrentAnalysis(null);

    try {
      if (!fileObj.file) {
        throw new Error("No file selected for upload.");
      }

      // Step 1: Upload PDF to Express Backend
      setProgress(35);
      setCurrentStep("Extracting PDF text and parsing resume sections...");
      
      let uploadRes;
      if (currentResumeId) {
        uploadRes = await resumeApi.uploadVersion(currentResumeId, fileObj.file);
      } else {
        uploadRes = await resumeApi.uploadResume(fileObj.file, fileObj.name);
      }

      if (!uploadRes.success) {
        throw new Error(uploadRes.error || "Failed to upload resume to server.");
      }

      const resumeId = uploadRes.data.resumeId || uploadRes.data.id;
      const versionId = uploadRes.data.id || uploadRes.data.currentVersion?.id;
      
      setCurrentResumeId(resumeId);
      setCurrentVersionId(versionId);

      // Step 2: Trigger AI Analysis
      setProgress(65);
      setCurrentStep(`Running ATS benchmarking engine against ${role}...`);

      const analyzeRes = await resumeApi.analyzeVersion(resumeId, versionId, {
        targetRole: role,
      });

      if (!analyzeRes.success) {
        throw new Error(analyzeRes.error || "AI Analysis processing failed.");
      }

      setProgress(100);
      setCurrentStep("Analysis Complete!");

      setCurrentAnalysis(analyzeRes.data);
      setHasAnalyzed(true);
      setActiveTab("overview");
    } catch (err: any) {
      setApiError(err?.message || "An error occurred during resume analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReRunAnalysis = async () => {
    if (!currentResumeId || !currentVersionId) return;
    setIsAnalyzing(true);
    setApiError(null);
    setProgress(30);
    setCurrentStep("Re-evaluating resume against updated parameters...");

    try {
      const analyzeRes = await resumeApi.analyzeVersion(currentResumeId, currentVersionId, {
        targetRole,
      });

      if (!analyzeRes.success) {
        throw new Error(analyzeRes.error || "Re-analysis failed.");
      }

      setProgress(100);
      setCurrentAnalysis(analyzeRes.data);
    } catch (err: any) {
      setApiError(err?.message || "Failed to re-run analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = () => {
    setApiError(null);
    setHasAnalyzed(true);
    setActiveTab("overview");
  };

  const scrollToUpload = () => {
    const el = document.getElementById("upload-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Helper Mappers for Components
  const scoreData: AtsScoreData = currentAnalysis ? {
    score: currentAnalysis.overallScore || 0,
    status: (currentAnalysis.overallScore || 0) >= 80 ? "Excellent" : (currentAnalysis.overallScore || 0) >= 65 ? "Good" : "Needs Improvement",
    summary: currentAnalysis.strengths?.[0] || "Your resume has been benchmarked against industry ATS rules.",
    metrics: {
      overall: currentAnalysis.overallScore || 0,
      readability: currentAnalysis.formattingScore || 85,
      structure: currentAnalysis.atsScore || 80,
      keywords: currentAnalysis.keywordScore || 75,
      impact: currentAnalysis.experienceScore || 70,
    },
    passedChecksCount: Math.round(((currentAnalysis.overallScore || 70) / 100) * 18),
    totalChecksCount: 18,
  } : {
    score: 88,
    status: "Excellent",
    summary: "Your resume passes 88% of automated ATS parsers.",
    metrics: { overall: 88, readability: 94, structure: 90, keywords: 84, impact: 86 },
    passedChecksCount: 16,
    totalChecksCount: 18,
  };

  const detectedSkills: SkillCategory[] = [
    {
      category: "Programming",
      skills: currentAnalysis?.extractedData?.skills || ["TypeScript", "JavaScript", "Python", "HTML/CSS"],
    },
    {
      category: "Frameworks",
      skills: ["React.js", "Next.js", "Node.js", "Express.js"],
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "MongoDB", "Redis"],
    },
  ];

  const missingSkills: MissingSkill[] = (currentAnalysis?.missingSkills || ["GraphQL", "Docker", "CI/CD"]).map((skill: string) => ({
    name: skill,
    importance: "High",
    reason: `Key required skill identified for ${targetRole} positions.`,
    suggestedAction: `Include ${skill} project experience or technical proficiency in your skills section.`,
  }));

  const feedbackItems: FeedbackItem[] = [
    ...(currentAnalysis?.weaknesses || []).map((w: string, idx: number) => ({
      id: `fb-weakness-${idx}`,
      category: "ATS Audit",
      severity: "High" as const,
      title: w,
      description: "Identified optimization area to increase recruiter screening response rate.",
      actionableTip: "Update your bullet points to address this gap.",
    })),
    ...(currentAnalysis?.recommendations || []).map((rec: string, idx: number) => ({
      id: `fb-rec-${idx}`,
      category: "Writing Style",
      severity: "Medium" as const,
      title: "Recommendation",
      description: rec,
      actionableTip: "Incorporate clear metrics and action verbs.",
    })),
  ];

  const sectionDetails: SectionDetail[] = [
    {
      id: "sec-summary",
      name: "Professional Summary",
      score: currentAnalysis?.summaryScore || 80,
      iconName: "FileText",
      strengths: [currentAnalysis?.strengths?.[0] || "Clear formatting and concise layout."],
      problems: [currentAnalysis?.weaknesses?.[0] || "Summary can be more targeted to target role."],
      suggestions: [currentAnalysis?.recommendations?.[0] || "Include key technical skills in summary."],
      sampleOriginalText: "Experienced Software Engineer working on fullstack web applications.",
      sampleImprovedText: "Results-driven Software Engineer with proven experience building scalable backend microservices and modern frontend applications.",
    },
    {
      id: "sec-experience",
      name: "Work Experience",
      score: currentAnalysis?.experienceScore || 75,
      iconName: "Briefcase",
      strengths: ["Chronological work history present."],
      problems: ["Some bullet points lack measurable outcome metrics."],
      suggestions: ["Quantify achievements with percentages and user growth."],
      sampleOriginalText: "Worked on frontend features and database operations.",
      sampleImprovedText: "Architected high-throughput REST APIs in Node.js & PostgreSQL, reducing query latency by 35%.",
    },
  ];

  return (
    <div className="min-h-screen pb-24">
      {/* 1. HERO HEADER */}
      <ResumeHero
        onUploadClick={scrollToUpload}
        onSampleClick={handleLoadSample}
      />

      {/* 2. UPLOADER CARD SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResumeUploader
          onAnalyze={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          progress={progress}
          currentStep={currentStep}
          onLoadSample={handleLoadSample}
        />
      </div>

      {/* ERROR BANNER */}
      {apiError && (
        <div className="max-w-4xl mx-auto mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* 3. RESUME ANALYSIS DASHBOARD */}
      {hasAnalyzed && (
        <section id="analysis-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8 animate-fadeIn">
          
          {/* Navigation Bar Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1">
              {[
                { id: "overview", label: "ATS Score & Audit", icon: BarChart3 },
                { id: "sections", label: "Section Breakdown", icon: Layers },
                { id: "skills", label: "Skill & Keyword Gaps", icon: CheckCircle2 },
                { id: "jd", label: "Job Description Match", icon: Briefcase },
                { id: "action", label: "Action Plan & Diff", icon: FileCheck },
                { id: "history", label: "Version History", icon: Sparkles },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isActive
                        ? "bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-md border border-slate-200/80 dark:border-slate-700"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-sky-500" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleReRunAnalysis}
              disabled={isAnalyzing}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-500 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
              <span>Re-run Analysis</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & SCORE */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <AtsScoreCard data={scoreData} />
              <AiFeedbackPanel feedbackItems={feedbackItems} />
            </div>
          )}

          {/* TAB 2: SECTIONS AUDIT */}
          {activeTab === "sections" && (
            <SectionAnalysisCards
              sections={sectionDetails}
              onOpenRewriter={(sec) => setActiveRewriterSection(sec)}
            />
          )}

          {/* TAB 3: SKILLS EXTRACTION */}
          {activeTab === "skills" && (
            <SkillExtractionGrid
              detectedSkills={detectedSkills}
              missingSkills={missingSkills}
              targetRole={targetRole}
            />
          )}

          {/* TAB 4: JOB DESCRIPTION MATCH */}
          {activeTab === "jd" && <JobDescriptionMatcher />}

          {/* TAB 5: ACTION PLAN & COMPARISON */}
          {activeTab === "action" && (
            <div className="space-y-8">
              <ResumeComparisonView />
              <ResumeActionPlan />
            </div>
          )}

          {/* TAB 6: HISTORY */}
          {activeTab === "history" && (
            <ResumeVersionHistory
              onSelectVersion={(v) => {
                setHasAnalyzed(true);
                setActiveTab("overview");
              }}
            />
          )}

          {/* RESPONSIBLE AI UX FOOTER DISCLAIMER */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center justify-center gap-2 text-center">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>
              <strong>Responsible AI UX:</strong> Review AI-generated suggestions before updating your resume. AI assists your drafting process without fabricating experience or credentials.
            </span>
          </div>

        </section>
      )}

      {/* AI SECTION REWRITER MODAL */}
      <AiSectionRewriter
        section={activeRewriterSection}
        onClose={() => setActiveRewriterSection(null)}
        onAccept={(secId, text) => {
          setActiveRewriterSection(null);
        }}
      />
    </div>
  );
}
