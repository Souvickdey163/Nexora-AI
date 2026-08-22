export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
  badge: string;
  isDemo?: boolean;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    role: "Software Engineering Intern",
    company: "Target Tech Tier-1",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    content: "Nexora's AI Mock Interview helped me identify my exact weak points in System Design. The real-time feedback loop gave me the confidence I needed to land my dream internship.",
    rating: 5,
    badge: "Demo Testimonial — Developer Community",
    isDemo: true,
  },
  {
    id: "2",
    name: "Ananya Roy",
    role: "Final Year CS Student",
    company: "Tier-1 Engineering College",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    content: "The Resume Intelligence tool flagged 6 critical missing ATS keywords for backend developer roles. After tweaking my bullet points, my response rate jumped significantly!",
    rating: 5,
    badge: "Demo Testimonial — Placement Prep",
    isDemo: true,
  },
  {
    id: "3",
    name: "Rohan Patel",
    role: "Full Stack Developer",
    company: "Early-Stage Startup",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    content: "GitHub Intelligence gave me an honest breakdown of my project portfolio quality. It pointed out missing documentation and architectural flaws that recruiters actually look at.",
    rating: 5,
    badge: "Demo Testimonial — Portfolio Readiness",
    isDemo: true,
  },
  {
    id: "4",
    name: "Priya Nair",
    role: "Associate Frontend Engineer",
    company: "Tech Product Firm",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    content: "Having an AI Career Mentor that generates custom weekly roadmaps based on my progress kept me consistent every single day during placement season.",
    rating: 5,
    badge: "Demo Testimonial — Career Guidance",
    isDemo: true,
  },
];
