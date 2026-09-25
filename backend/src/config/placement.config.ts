export const PLACEMENT_WEIGHTS = {
  INTERVIEW: 0.40,
  CODING: 0.30,
  RESUME: 0.15,
  ROADMAP: 0.15,
} as const;

export type DimensionKey = keyof typeof PLACEMENT_WEIGHTS;

export interface ReadinessLevelConfig {
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
  color: string;
}

export const READINESS_LEVELS: ReadinessLevelConfig[] = [
  {
    minScore: 0,
    maxScore: 39,
    label: "Needs Attention",
    description: "Your preparation evidence is currently minimal. Focus on completing basic practice milestones.",
    color: "#EF4444" // red
  },
  {
    minScore: 40,
    maxScore: 59,
    label: "Developing",
    description: "You have established core foundational evidence, but critical technical or interview gaps remain.",
    color: "#F59E0B" // amber
  },
  {
    minScore: 60,
    maxScore: 74,
    label: "Progressing",
    description: "Solid progress across multiple dimensions. Targeted practice in weaker areas will boost your readiness.",
    color: "#3B82F6" // blue
  },
  {
    minScore: 75,
    maxScore: 89,
    label: "Strong Preparation",
    description: "High consistency and evidence level across key areas. Fine-tune system design and interview structure.",
    color: "#10B981" // emerald
  },
  {
    minScore: 90,
    maxScore: 100,
    label: "Highly Prepared",
    description: "Exceptional evidence profile across coding, interviews, resume, and roadmap milestones.",
    color: "#6366F1" // indigo
  }
];

export function getReadinessLevel(score: number): ReadinessLevelConfig {
  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const level = READINESS_LEVELS.find(
    (l) => boundedScore >= l.minScore && boundedScore <= l.maxScore
  );
  return level || READINESS_LEVELS[0];
}

export const TARGET_ROLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "Data Scientist",
  "ML Engineer",
  "DevOps Engineer",
  "QA Engineer",
] as const;

export type TargetRole = typeof TARGET_ROLES[number] | string;

export const COMPANY_CATEGORIES = [
  "Product Technology",
  "Tier-1 Technology Startups",
  "Global IT Services",
] as const;

export type CompanyCategory = typeof COMPANY_CATEGORIES[number];

export const COMPANY_CATEGORY_DETAILS: Record<CompanyCategory, {
  label: string;
  focus: string;
  keyAreas: string[];
}> = {
  "Product Technology": {
    label: "Product Technology",
    focus: "Strong coding fundamentals, system design, scalable architecture, and technical interview depth.",
    keyAreas: ["Data Structures & Algorithms", "System Design & Scalability", "Coding Accuracy under time constraints", "In-depth Technical Interviews"]
  },
  "Tier-1 Technology Startups": {
    label: "Tier-1 Technology Startups",
    focus: "Practical engineering execution, full-stack or deep domain ownership, adaptability, and shipping real projects.",
    keyAreas: ["End-to-End System Ownership", "Practical Framework & Tool Mastery", "Resume Project Verification", "Speed & Product Instincts"]
  },
  "Global IT Services": {
    label: "Global IT Services",
    focus: "Core CS fundamentals, structured programming, consistent problem-solving, and professional communication.",
    keyAreas: ["Core CS Fundamentals (DBMS, OS, CN)", "Structured Programming & Logic", "Aptitude & Technical Assessments", "Behavioral & Communication Clarity"]
  }
};
