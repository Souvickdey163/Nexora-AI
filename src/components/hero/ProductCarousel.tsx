"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface SlideItem {
  id: string;
  title: string;
  category: string;
  image: string;
  alt: string;
  description: string;
}

const CAROUSEL_SLIDES: SlideItem[] = [
  {
    id: "hero-slide-1",
    title: "AI Cognitive Intelligence & Model Architecture",
    category: "AI Core Model",
    image: "/images/hero-slide-1.png",
    alt: "AI Neural Network and Model Intelligence Diagram",
    description: "Advanced generative AI models tailored specifically for real-time career guidance and placement scoring.",
  },
  {
    id: "hero-slide-2",
    title: "Neural Network & Skill Assessment System",
    category: "Career Copilot",
    image: "/images/hero-slide-2.png",
    alt: "Neural network connectivity visualization for career assessment",
    description: "Deep skill assessment mapping candidates to tech industry standards with automated feedback loops.",
  },
  {
    id: "hero-slide-3",
    title: "Futuristic Tech & Placement Infrastructure",
    category: "Placement Platform",
    image: "/images/hero-slide-3.png",
    alt: "Futuristic digital technology visual representation",
    description: "End-to-end recruitment readiness ecosystem for engineering graduates and tech developers.",
  },
  {
    id: "hero-slide-4",
    title: "Nexora AI Developer & Placement Suite",
    category: "Developer Suite",
    image: "/images/hero-slide-4.png",
    alt: "Nexora AI Developer Ecosystem and Intelligence Suite",
    description: "Comprehensive suite empowering students, job seekers, and recruiters with AI-driven placement scoring.",
  },
  {
    id: "resume-intelligence",
    title: "AI Resume Intelligence",
    category: "Resume & ATS Optimization",
    image: "/images/resume-intelligence.png",
    alt: "AI Robotic Hand holding Resume Clipboard for automated ATS scoring",
    description: "Analyze resumes, calculate ATS score, detect missing skills, and get instant rewrite suggestions.",
  },
  {
    id: "mock-interview-1",
    title: "AI Interactive Mock Interview",
    category: "Interview Intelligence",
    image: "/images/hirevue-mock-interview.png",
    alt: "AI Mock Video Interview Interface showing performance ratings and problem-solving evaluation",
    description: "Simulate high-stakes technical & behavioral interview rounds with real-time AI audio, transcript, and STAR feedback.",
  },
  {
    id: "recruiter-workflow",
    title: "AI Recruiter & Placement Matching",
    category: "Placement Readiness",
    image: "/images/ai-recruiter-workflow.png",
    alt: "AI Recruiter workflow analyzing candidate profile matches and skill ratings",
    description: "Evaluate your company compatibility score and discover critical skill gaps for top tech roles.",
  },
  {
    id: "github-intelligence",
    title: "GitHub Intelligence",
    category: "Project Portfolio",
    image: "/images/github-intelligence.png",
    alt: "GitHub Code Repository Analysis on Dark IDE Laptop",
    description: "Analyze GitHub repos, architecture quality, documentation, test coverage, and technical depth.",
  },
  {
    id: "interview-panel",
    title: "Real-World Hiring Panel Simulation",
    category: "Candidate Confidence",
    image: "/images/interview-panel.png",
    alt: "Professional interview panel evaluating candidate responses",
    description: "Build candidate confidence with realistic panel scenario simulations and technical question banks.",
  },
  {
    id: "online-prep",
    title: "Coding Arena & Technical Skill Practice",
    category: "DSA & Problem Solving",
    image: "/images/online-job-prep.png",
    alt: "Online job interview preparation tips and interactive coding assessment interface",
    description: "Practice coding problems with space-time complexity analysis and step-by-step AI hint guidance.",
  },
  {
    id: "career-analytics",
    title: "Career Analytics & Performance Dashboard",
    category: "Performance Tracking",
    image: "/images/career-analytics.png",
    alt: "Dual Monitor Career Analytics Dashboard showing spreadsheets and performance graphs",
    description: "Track coding velocity, mock interview scores, resume health, and overall placement readiness.",
  },
  {
    id: "placement-analytics-3d",
    title: "Data-Driven Clarity for Your Placement Journey",
    category: "Placement Telemetry",
    image: "/images/placement-analytics-3d.png",
    alt: "3D Isometric Placement Analytics Dashboard with charts, bar graphs, and laptop",
    description: "Real-time telemetry across all core career domains so you always know where to focus your effort next.",
  },
  {
    id: "candidates-waiting",
    title: "Placement Preparation Community",
    category: "Peer Benchmark",
    image: "/images/candidates-waiting.jpg",
    alt: "Candidates preparing for career placement interviews",
    description: "Benchmark your skills against peer engineering candidates and track your placement readiness timeline.",
  },
];

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % CAROUSEL_SLIDES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeSlide = CAROUSEL_SLIDES[currentIndex];

  return (
    <div className="relative w-full max-w-full mx-auto rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl shadow-sky-500/10">
      {/* Tall height showcase container */}
      <div className="relative h-[450px] sm:h-[550px] md:h-[650px] lg:h-[720px] w-full bg-slate-950">
        {CAROUSEL_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                unoptimized
                sizes="100vw"
                className="object-cover object-center w-full h-full"
              />

              {/* Bottom Text Banner Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent pt-16 pb-8 px-6 md:px-10 z-20">
                <div className="max-w-3xl space-y-1.5">
                  <h3 className="text-xl md:text-3xl font-bold text-white tracking-tight drop-shadow-md">
                    {slide.title}
                  </h3>
                  <p className="text-xs md:text-base text-slate-200 line-clamp-2 leading-relaxed drop-shadow">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Top Category Badge */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-white text-xs font-semibold shadow-lg">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>{activeSlide.category}</span>
        </div>
      </div>
    </div>
  );
}
