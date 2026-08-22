export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export const FAQS: FAQItem[] = [
  {
    question: "What is Nexora AI?",
    answer: "Nexora AI is an all-in-one AI-powered Career Intelligence Platform tailored for students and early-career software developers. It unifies resume optimization, mock interviews, coding challenges, GitHub portfolio analysis, and personalized career roadmaps into one intelligent workspace.",
  },
  {
    question: "Who is Nexora designed for?",
    answer: "Nexora is built for computer science students, self-taught developers, bootcamp graduates, and early-career engineers looking to prepare smarter for job placements, technical interviews, and career advancement.",
  },
  {
    question: "How does Resume Intelligence work?",
    answer: "Our Resume Intelligence engine parses your resume content against real-world ATS algorithms and target job descriptions. It calculates an ATS compatibility score, detects missing high-impact technical keywords, identifies weak bullet points, and provides AI-driven rewrite suggestions.",
  },
  {
    question: "How does the AI Mock Interview work?",
    answer: "The AI Mock Interview simulates realistic technical, behavioral, HR, and system-design interview rounds. You can answer via text or speech, and the AI evaluates your responses for technical accuracy, communication clarity, problem-solving structure, and STAR-method adherence.",
  },
  {
    question: "Can I practice coding directly on Nexora?",
    answer: "Yes! Nexora includes an interactive Coding Arena with multi-language code editing, real-time code reviews, step-by-step AI hints, and automated time and space complexity evaluations across tagged DSA problem sets.",
  },
  {
    question: "How does GitHub Intelligence work?",
    answer: "GitHub Intelligence analyzes your public repositories, code architecture, commit history, README clarity, and test coverage to give you an objective readiness score and actionable suggestions to make your portfolio recruiter-ready.",
  },
  {
    question: "Is my data secure on Nexora?",
    answer: "Absolutely. We treat user privacy with top priority. Your resume data, code submissions, interview recordings, and career profiles are encrypted and never shared with third parties or used to train public AI models without your explicit consent.",
  },
  {
    question: "Are placement predictions guaranteed?",
    answer: "No. Nexora provides data-driven estimates, skill-gap analysis, and compatibility scores to assist your preparation. They are actionable insights designed to guide your practice, not guaranteed job placement promises.",
  },
  {
    question: "Can I use Nexora on mobile devices?",
    answer: "Yes! Nexora is fully responsive and optimized for seamless experience across desktop, tablet, and mobile devices.",
  },
];
