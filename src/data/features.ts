import {
  FileText,
  Video,
  Code2,
  BrainCircuit,
  BarChart3,
  Building2,
  Compass,
  Award,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "@/components/common/GithubIcon";

export interface FeatureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  benefits: string[];
  image: string;
  badge?: string;
}

export const FEATURES: FeatureItem[] = [
  {
    id: "resume-intelligence",
    title: "AI Resume Intelligence",
    category: "Resume & ATS Optimization",
    description: "Analyze resumes, calculate ATS score, detect missing skills, and get instant rewrite suggestions.",
    longDescription: "Transform your resume with AI-driven ATS optimization. Compare your profile against target job descriptions, discover missing industry keywords, and format bullet points for maximum recruiter impact.",
    icon: FileText,
    href: "/resume",
    benefits: [
      "Real-time ATS score calculation & gap analysis",
      "Action-verb & impact metric recommendations",
      "Targeted skill keyword insertion",
      "Export ready-to-send PDF formatting",
    ],
    image: "/images/resume-intelligence.png",
    badge: "Popular",
  },
  {
    id: "mock-interview",
    title: "AI Mock Interview",
    category: "Interview Preparation",
    description: "Practice HR, technical, behavioral, and system-design interviews with real-time AI feedback.",
    longDescription: "Simulate high-stakes technical & behavioral interviews with an adaptive AI interviewer. Receive instant performance feedback on technical accuracy, clarity, confidence, and structure.",
    icon: Video,
    href: "/interview",
    benefits: [
      "Role-specific interview simulations (Frontend, Backend, System Design, HR)",
      "Audio & transcript sentiment analysis",
      "STAR method response structuring tips",
      "Detailed scoring rubric across 5 dimensions",
    ],
    image: "/images/hirevue-mock-interview.png",
    badge: "Interactive",
  },
  {
    id: "coding-arena",
    title: "Coding Arena",
    category: "Problem Solving",
    description: "Solve curated coding challenges in a professional code editor with AI-powered reviews.",
    longDescription: "Master Data Structures & Algorithms with an integrated code editor. Get real-time hint generation, space-time complexity analysis, and automated test-case evaluation.",
    icon: Code2,
    href: "/coding",
    benefits: [
      "Multi-language support (Python, TypeScript, C++, Java)",
      "Automated time & space complexity analysis",
      "Step-by-step AI hint system without spoiling solutions",
      "Company-wise tagged DSA problem sets",
    ],
    image: "/images/online-job-prep.png",
  },
  {
    id: "career-mentor",
    title: "AI Career Mentor",
    category: "Guidance & Coaching",
    description: "Get personalized 24/7 career guidance, learning recommendations, and study plans.",
    longDescription: "Your personal career strategist available 24/7. Ask questions about career paths, resume dilemmas, salary negotiations, or learning roadmaps tailored to your target roles.",
    icon: BrainCircuit,
    href: "/mentor",
    benefits: [
      "Customized study plans tailored to target job roles",
      "On-demand career advice & interview strategies",
      "Project idea generation based on current market trends",
      "Step-by-step guidance for transition into tech roles",
    ],
    image: "/images/ai-recruiter-workflow.png",
  },
  {
    id: "github-intelligence",
    title: "GitHub Intelligence",
    category: "Project Portfolio",
    description: "Analyze GitHub repos, architecture quality, documentation, and technical depth.",
    longDescription: "Elevate your open-source profile. Nexora evaluates your repository architecture, commit consistency, README quality, test coverage, and code structure for recruiter visibility.",
    icon: GithubIcon,
    href: "/github",
    benefits: [
      "Repository architecture & code quality evaluation",
      "README & documentation impact score",
      "Commit frequency & contribution health analysis",
      "Suggestions to make projects portfolio-ready",
    ],
    image: "/images/github-intelligence.png",
    badge: "New",
  },
  {
    id: "career-analytics",
    title: "Career Analytics",
    category: "Performance Tracking",
    description: "Track coding progress, interview scores, resume health, and overall career readiness.",
    longDescription: "Unify all your growth metrics in one unified dashboard. Track weekly coding velocity, mock interview improvement curves, and skill readiness indexes.",
    icon: BarChart3,
    href: "/analytics",
    benefits: [
      "Unified Career Readiness Index (0-100%)",
      "Skill proficiency breakdown (DSA, Web Dev, System Design)",
      "Weekly activity heatmaps & milestone tracking",
      "Benchmarking against peer developer profiles",
    ],
    image: "/images/career-analytics.png",
  },
  {
    id: "placement-intelligence",
    title: "Placement Intelligence",
    category: "Company Matching",
    description: "Estimate company compatibility, skill-gap analysis, and tier-1 readiness insights.",
    longDescription: "Know where you stand before applying. Nexora matches your current skill matrix against tier-1 tech companies and startups to highlight exact gap areas.",
    icon: Building2,
    href: "/placement",
    benefits: [
      "Target company compatibility scoring",
      "Critical skill-gap identification per job role",
      "Custom interview prep guides by company",
      "Placement readiness timeline estimation",
    ],
    image: "/images/interview-panel.png",
  },
  {
    id: "career-roadmap",
    title: "Personalized Roadmap",
    category: "Structured Growth",
    description: "Generate customized daily, weekly, and monthly action plans for your dream role.",
    longDescription: "Stop guessing what to study next. Receive a dynamic, step-by-step career path that adapts to your learning pace, target timelines, and skill gaps.",
    icon: Compass,
    href: "/roadmap",
    benefits: [
      "Adaptive daily & weekly milestone tracking",
      "Curated resource linking for every topic",
      "Project milestones mapped to real-world software engineering",
      "Automated milestone checks & progress updates",
    ],
    image: "/images/candidates-waiting.jpg",
  },
  {
    id: "skill-assessment",
    title: "Skill Assessment",
    category: "Evaluation Engine",
    description: "Evaluate DSA, Core CS (OS, CN, DBMS, OOP), System Design, and Soft Skills.",
    longDescription: "Comprehensive diagnostic testing engine for computer science fundamentals. Test your knowledge under timed conditions with AI-generated explanations.",
    icon: Award,
    href: "/roadmap",
    benefits: [
      "Timed adaptive diagnostic tests",
      "Detailed topic-wise strength & weakness report",
      "Core CS fundamentals verification (DBMS, OS, Networks)",
      "Sharpen technical communication & articulation",
    ],
    image: "/images/online-job-prep.png",
  },
  {
    id: "learning-hub",
    title: "Learning Hub",
    category: "Resource Library",
    description: "Discover curated learning resources, cheat sheets, and interview prep guides.",
    longDescription: "Access a handpicked repository of high-value learning material, system design cheat sheets, DSA patterns, and behavioral interview templates.",
    icon: BookOpen,
    href: "/roadmap",
    benefits: [
      "Curated DSA pattern guides & top 100 questions",
      "System design architecture templates",
      "Behavioral interview STAR method workbooks",
      "Curated video & article resource index",
    ],
    image: "/images/interview-panel.png",
  },
];
