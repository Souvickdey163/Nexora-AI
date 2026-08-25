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
import { ResumeVersionHistory, VersionItem } from "./ResumeVersionHistory";
import { Sparkles, BarChart3, Layers, Briefcase, FileCheck, CheckCircle2, ShieldCheck, RefreshCw } from "lucide-react";

// MOCK ANALYSIS DATA FOR PRODUCTION-QUALITY DEMONSTRATION
const MOCK_ATS_DATA: AtsScoreData = {
  score: 88,
  status: "Excellent",
  summary: "Your resume passes 88% of automated ATS parsers for Senior & Staff Software Engineering roles.",
  metrics: {
    overall: 88,
    readability: 94,
    structure: 90,
    keywords: 84,
    impact: 86,
  },
  passedChecksCount: 16,
  totalChecksCount: 18,
};

const MOCK_DETECTED_SKILLS: SkillCategory[] = [
  {
    category: "Programming",
    skills: ["TypeScript", "JavaScript (ES6+)", "Python", "Golang", "HTML5/CSS3"],
  },
  {
    category: "Frameworks",
    skills: ["React.js", "Next.js", "Node.js", "Express.js", "TailwindCSS", "Redux Toolkit"],
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB", "Redis", "Prisma ORM"],
  },
  {
    category: "Tools",
    skills: ["Git & GitHub", "Docker", "AWS (S3, EC2)", "Vercel", "Jest / Vitest", "CI/CD"],
  },
  {
    category: "Soft Skills",
    skills: ["Technical Leadership", "Agile Development", "System Design", "Cross-Functional Collaboration"],
  },
];

const MOCK_MISSING_SKILLS: MissingSkill[] = [
  {
    name: "GraphQL & Apollo Client",
    importance: "Essential",
    reason: "Requested in 64% of Full-Stack Tech Lead job descriptions.",
    suggestedAction: "Add GraphQL API consumption to your side-project section.",
  },
  {
    name: "Kubernetes (k8s)",
    importance: "High",
    reason: "Preferred for enterprise cloud orchestration roles.",
    suggestedAction: "Include basic deployment manifest experience.",
  },
  {
    name: "Playwright / Cypress",
    importance: "Medium",
    reason: "Automated E2E test coverage requirement for senior frontend positions.",
    suggestedAction: "Mention end-to-end testing setup in experience bullet points.",
  },
];

const MOCK_SECTIONS: SectionDetail[] = [
  {
    id: "sec-summary",
    name: "Professional Summary",
    score: 90,
    iconName: "FileText",
    strengths: [
      "Clear title branding (Senior Full-Stack Engineer)",
      "Quantified total years of experience (5+ years)",
      "Clean formatting without special characters",
    ],
    problems: [
      "Lacks target domain keywords (GraphQL, Micro-frontends)",
    ],
    suggestions: [
      "Include key technical domain focus in sentence 2 of your summary.",
    ],
    sampleOriginalText:
      "Passionate Software Engineer with 5 years experience building web applications using React, Node.js, and TypeScript. Looking for a full-stack engineering role at a fast-growing tech company.",
    sampleImprovedText:
      "Results-driven Senior Full-Stack Engineer with 5+ years of experience architecting high-throughput React/Next.js and Node.js micro-services. Proven track record of boosting platform page velocity by 40% and deploying cloud infrastructure serving 500K+ active monthly users.",
  },
  {
    id: "sec-experience",
    name: "Work Experience",
    score: 84,
    iconName: "Briefcase",
    strengths: [
      "Uses strong initial action verbs (Engineered, Spearheaded, Optimized)",
      "Clear chronological sequence with standard month/year dates",
    ],
    problems: [
      "2 bullet points lack quantifiable outcome metrics ($ saved, % speedup)",
      "Uncommon abbreviation used for Cloud Services",
    ],
    suggestions: [
      "Quantify bullet 3 by mentioning user growth or latency reductions.",
    ],
    sampleOriginalText:
      "Worked on frontend performance optimizations and refactored API calls to make the web application faster for users.",
    sampleImprovedText:
      "Spearheaded frontend performance optimizations across 12 React micro-apps, reducing Time-To-Interactive (TTI) by 42% and increasing lighthouse performance scores from 68 to 96.",
  },
  {
    id: "sec-projects",
    name: "Projects & Technical Work",
    score: 92,
    iconName: "FolderGit2",
    strengths: [
      "Live URLs and GitHub links included",
      "Explicit technical stack mentions per project",
    ],
    problems: [
      "Project descriptions could highlight architecture complexity further",
    ],
    suggestions: [
      "Add 1 line explaining system architecture design choices.",
    ],
    sampleOriginalText:
      "Built a real-time collaborative code editor app using React and Socket.io with syntax highlighting.",
    sampleImprovedText:
      "Engineered a real-time collaborative IDE platform supporting multi-user WebSocket synchronization, Monaco Editor integration, and sub-50ms code execution telemetry.",
  },
  {
    id: "sec-education",
    name: "Education & Certifications",
    score: 95,
    iconName: "GraduationCap",
    strengths: [
      "Degree title, major, and graduation year formatted standardly",
      "No unnecessary high-school coursework listed",
    ],
    problems: [],
    suggestions: ["Section format is optimal for ATS parsing."],
    sampleOriginalText: "B.S. in Computer Science — State University (2019-2023)",
    sampleImprovedText: "Bachelor of Science in Computer Science | State University (2019 – 2023)",
  },
];

const MOCK_FEEDBACK: FeedbackItem[] = [
  {
    id: "fb-1",
    category: "ATS Parser",
    severity: "High",
    title: "Standardize Work Experience Date Format",
    description: "Inconsistent date formatting ('Jan 2022 - Present' vs '2020/05') can confuse automated Workday parsers.",
    actionableTip: "Use 'MMM YYYY - MMM YYYY' format consistently throughout.",
  },
  {
    id: "fb-2",
    category: "Technical Depth",
    severity: "High",
    title: "Add Missing High-Volume Tech Keywords",
    description: "Keywords 'GraphQL' and 'CI/CD' are missing from the primary skills block.",
    actionableTip: "Add GraphQL, Apollo, and GitHub Actions to the tools grid.",
  },
  {
    id: "fb-3",
    category: "Writing Style",
    severity: "Medium",
    title: "Strengthen Passive Verbs in Experience Bullets",
    description: "Phrases like 'Responsible for' and 'Helped with' weaken candidate impact.",
    actionableTip: "Replace with 'Architected', 'Spearheaded', or 'Delivered'.",
  },
  {
    id: "fb-4",
    category: "Formatting",
    severity: "Low",
    title: "Remove Double Columns in Skills Block",
    description: "Multi-column tables can cause text order mixing in older ATS software.",
    actionableTip: "Use single-column text or clean bulleted lists.",
  },
];

export function ResumePageClient() {
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("Initializing ATS Parser...");
  const [activeTab, setActiveTab] = useState<"overview" | "sections" | "skills" | "jd" | "action" | "history">("overview");
  const [activeRewriterSection, setActiveRewriterSection] = useState<SectionDetail | null>(null);

  const handleStartAnalysis = (file: any, role: string) => {
    setIsAnalyzing(true);
    setProgress(15);
    setCurrentStep("Parsing PDF structure and extracting text...");

    setTimeout(() => {
      setProgress(45);
      setCurrentStep(`Benchmarking against ${role} role requirements...`);
    }, 600);

    setTimeout(() => {
      setProgress(75);
      setCurrentStep("Evaluating action verb impact & keyword density...");
    }, 1200);

    setTimeout(() => {
      setProgress(100);
      setCurrentStep("Analysis Complete!");
      setTimeout(() => {
        setIsAnalyzing(false);
        setHasAnalyzed(true);
        setActiveTab("overview");
      }, 400);
    }, 1800);
  };

  const handleLoadSample = () => {
    setHasAnalyzed(true);
    setActiveTab("overview");
  };

  const scrollToUpload = () => {
    const el = document.getElementById("upload-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

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
                    onClick={() => setActiveTab(tab.id as any)}
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
              onClick={handleLoadSample}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-500 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run Analysis</span>
            </button>
          </div>

          {/* TAB 1: OVERVIEW & SCORE */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <AtsScoreCard data={MOCK_ATS_DATA} />
              <AiFeedbackPanel feedbackItems={MOCK_FEEDBACK} />
            </div>
          )}

          {/* TAB 2: SECTIONS AUDIT */}
          {activeTab === "sections" && (
            <SectionAnalysisCards
              sections={MOCK_SECTIONS}
              onOpenRewriter={(sec) => setActiveRewriterSection(sec)}
            />
          )}

          {/* TAB 3: SKILLS EXTRACTION */}
          {activeTab === "skills" && (
            <SkillExtractionGrid
              detectedSkills={MOCK_DETECTED_SKILLS}
              missingSkills={MOCK_MISSING_SKILLS}
              targetRole="Full-Stack Engineer"
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
