"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles, ArrowDown, CheckCircle2 } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  category: string;
  image: string;
  secondaryImage: string;
  alt: string;
  description: string;
  badge: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "resume-intelligence",
    title: "AI Resume Intelligence & ATS Scoring",
    category: "Resume AI",
    image: "/images/resume-intelligence.png",
    secondaryImage: "/images/career-analytics.png",
    alt: "AI Resume Intelligence dashboard showing ATS optimization score",
    description: "Analyze resumes, calculate ATS compatibility, and get real-time rewrite suggestions.",
    badge: "98.4% ATS Match",
  },
  {
    id: "mock-interview",
    title: "Interactive AI Mock Interviews",
    category: "Mock Interviews",
    image: "/images/hirevue-mock-interview.png",
    secondaryImage: "/images/interview-panel.png",
    alt: "AI Mock Interview session with real-time feedback",
    description: "Simulate technical & behavioral hiring rounds with STAR audio feedback.",
    badge: "Real-time AI Feedback",
  },
  {
    id: "github-intelligence",
    title: "GitHub Portfolio & Code Analysis",
    category: "GitHub Intelligence",
    image: "/images/github-intelligence.png",
    secondaryImage: "/images/hero-slide-4.png",
    alt: "GitHub Code Repository Analysis on Dark IDE",
    description: "Deep repository scan analyzing architecture quality, documentation & test depth.",
    badge: "Deep Code Audit",
  },
  {
    id: "coding-arena",
    title: "Coding Arena & DSA Skill Practice",
    category: "Coding Arena",
    image: "/images/online-job-prep.png",
    secondaryImage: "/images/placement-analytics-3d.png",
    alt: "Coding Assessment Interface with AI hints",
    description: "Solve curated interview problems with step-by-step space-time complexity analysis.",
    badge: "Space-Time Telemetry",
  },
  {
    id: "career-analytics",
    title: "Career Analytics & Placement Roadmap",
    category: "Career Analytics",
    image: "/images/career-analytics.png",
    secondaryImage: "/images/ai-recruiter-workflow.png",
    alt: "Career Telemetry Dashboard showing progress metrics",
    description: "Comprehensive telemetry across all placement domains to accelerate career growth.",
    badge: "360° Placement Score",
  },
];

export function HeroImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % HERO_SLIDES.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const activeSlide = HERO_SLIDES[currentIndex];
  const nextSlide = HERO_SLIDES[(currentIndex + 1) % HERO_SLIDES.length];

  return (
    <div
      className="relative w-full min-w-0 max-w-full mx-auto space-y-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Glow Backdrop */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500/20 via-indigo-500/20 to-cyan-500/20 rounded-[2.5rem] blur-2xl opacity-70 transition duration-500 -z-10" />

      {/* TOP MAIN SHOWCASE CARD — Sleek Compact Height, Wide Widescreen Aspect */}
      <div className="relative w-full h-[320px] sm:h-[380px] md:h-[420px] lg:h-[440px] rounded-[2rem] overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-2xl shadow-sky-500/10 shrink-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority={index === 0}
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center w-full h-full"
              />

              {/* Bottom Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent pt-16 pb-5 px-6 sm:px-8 z-20">
                <div className="max-w-xl space-y-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow">
                    {slide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed drop-shadow">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Top Category Badge */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-white text-xs font-semibold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{activeSlide.category}</span>
        </div>

        {/* Previous / Next Controls */}
        <button
          onClick={goToPrev}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white border border-slate-700/50 flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={goToNext}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-white border border-slate-700/50 flex items-center justify-center backdrop-blur-sm transition-all focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-3 right-6 z-20 flex items-center gap-1.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-sky-400" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* BOTTOM SECONDARY SHOWCASE STRIP */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-0.5">
        
        {/* Secondary Rounded Pill Image Card */}
        <div
          className="relative w-full sm:w-3/5 h-16 sm:h-20 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-slate-950 shadow-md group cursor-pointer shrink-0"
          onClick={goToNext}
        >
          <Image
            src={activeSlide.secondaryImage}
            alt="Secondary feature preview"
            fill
            unoptimized
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors" />
          
          <div className="absolute inset-x-3 bottom-2 z-10 flex items-center justify-between text-white">
            <span className="text-[11px] font-semibold bg-slate-900/80 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-slate-700/60 truncate max-w-[160px]">
              Next: {nextSlide.category}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 shrink-0">
              <span>{activeSlide.badge}</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Decorative Grid Lines + Scroll Anchor */}
        <div className="flex-1 w-full flex items-center justify-between sm:justify-end gap-3 px-1">
          {/* Subtle Horizontal Decorative Lines */}
          <div className="flex-1 hidden sm:flex flex-col gap-1 opacity-20 dark:opacity-40">
            <div className="h-[1px] bg-slate-400 dark:bg-slate-500 w-full" />
            <div className="h-[1px] bg-slate-400 dark:bg-slate-500 w-3/4" />
            <div className="h-[1px] bg-slate-400 dark:bg-slate-500 w-1/2" />
          </div>

          <a
            href="#features"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors shrink-0"
          >
            <span>Explore Features</span>
            <ArrowDown className="w-3.5 h-3.5 text-sky-500 animate-bounce" />
          </a>
        </div>

      </div>
    </div>
  );
}
