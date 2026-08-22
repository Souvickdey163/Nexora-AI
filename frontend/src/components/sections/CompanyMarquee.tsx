"use client";

import React from "react";

interface Company {
  name: string;
  category: string;
  logoSvg: React.ReactNode;
}

const COMPANIES: Company[] = [
  {
    name: "Google",
    category: "FAANG / AI",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    ),
  },
  {
    name: "Microsoft",
    category: "Cloud & AI",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <rect x="1" y="1" width="10" height="10" fill="#F25022" />
        <rect x="13" y="1" width="10" height="10" fill="#7FBA00" />
        <rect x="1" y="13" width="10" height="10" fill="#00A4EF" />
        <rect x="13" y="13" width="10" height="10" fill="#FFB900" />
      </svg>
    ),
  },
  {
    name: "Apple",
    category: "Hardware & Software",
    logoSvg: (
      <svg className="w-5 h-5 fill-slate-900 dark:fill-slate-100" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.64-.78 1.08-1.85.96-2.93-.93.04-2.06.62-2.73 1.4-.6.69-1.13 1.79-.98 2.85 1.04.08 2.11-.53 2.75-1.32z" />
      </svg>
    ),
  },
  {
    name: "Amazon",
    category: "Cloud & E-Commerce",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path fill="#FF9900" d="M13.93 11.45c-.47-.32-1.25-.66-2.34-.66-2.45 0-3.66 1.34-3.66 2.94 0 1.63 1.13 2.68 2.96 2.68 1.14 0 2.06-.44 2.67-1.07v.88c0 .87-.69 1.41-1.78 1.41-1.04 0-1.87-.39-2.39-.81l-.88 1.25c.78.69 2.09 1.14 3.59 1.14 2.22 0 3.75-1.19 3.75-3.34v-5.22h-1.92v.8zm-.28 2.48c-.44.47-1.09.78-1.84.78-.97 0-1.53-.53-1.53-1.31 0-.91.75-1.5 2.12-1.5.47 0 .94.09 1.25.22v1.81zM15.42 20.35c3.67-1.16 6.58-3.75 8.16-7.22.25-.56.03-.84-.59-.59-2.75 1.12-5.75 1.75-8.81 1.75-4.16 0-8.25-1.16-11.84-3.34-.53-.31-.91 0-.53.5 3.38 4.41 8.59 7.16 13.61 8.9z" />
      </svg>
    ),
  },
  {
    name: "Meta",
    category: "Social & AI",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0668E1">
        <path d="M16.42 2C13.2 2 11.23 4.25 9.77 6.47 8.35 4.28 6.35 2 3.19 2 0 2 0 5.86 0 7.82c0 4.88 4.49 10.18 9.77 10.18 3.19 0 5.16-2.25 6.65-4.47 1.42 2.19 3.42 4.47 6.58 4.47 3.19 0 3.19-3.86 3.19-5.82C26.19 7.3 21.7 2 16.42 2zM9.77 14.5c-3.19 0-6.19-3.47-6.19-6.68 0-1.5 0-3.32 1.61-3.32 2.25 0 3.86 2.25 5.08 4.12A18.8 18.8 0 0 0 9.77 14.5zm6.65 0a18.8 18.8 0 0 0-.58-5.88c1.22-1.87 2.83-4.12 5.08-4.12 1.61 0 1.61 1.82 1.61 3.32 0 3.21-3 6.68-6.11 6.68z" />
      </svg>
    ),
  },
  {
    name: "Netflix",
    category: "Streaming & Infrastructure",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#E50914">
        <path d="M5.398 0v24h4.161V11.238l5.247 12.762h4.196V0h-4.161v12.762L9.594 0z" />
      </svg>
    ),
  },
  {
    name: "NVIDIA",
    category: "AI Chips & GPU",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#76B900">
        <path d="M8.7 15.6c.7.4 1.6.6 2.5.6 2.5 0 4.1-1.7 4.1-4.2s-1.6-4.2-4.1-4.2c-.9 0-1.8.2-2.5.6v7.2zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "OpenAI",
    category: "Generative AI",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#10A37F">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729z" />
      </svg>
    ),
  },
  {
    name: "Tesla",
    category: "Autonomous & Robotics",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#E82127">
        <path d="M12 4.5C7 4.5 2.73 6.61 0 9.87l1.76 1.76C4.1 8.89 7.78 7.25 12 7.25s7.9 1.64 10.24 4.38L24 9.87C21.27 6.61 17 4.5 12 4.5zM12 12c-2.48 0-4.5 2.02-4.5 4.5S9.52 21 12 21s4.5-2.02 4.5-4.5S14.48 12 12 12z" />
      </svg>
    ),
  },
  {
    name: "Uber",
    category: "Mobility & Tech",
    logoSvg: (
      <svg className="w-5 h-5 fill-slate-900 dark:fill-white" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
      </svg>
    ),
  },
  {
    name: "Airbnb",
    category: "Marketplace Tech",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF5A5F">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 17.93c-3.95 0-7.15-3.2-7.15-7.15S9.05 3.63 13 3.63s7.15 3.2 7.15 7.15-3.2 7.15-7.15 7.15z" />
      </svg>
    ),
  },
  {
    name: "Adobe",
    category: "Creative Cloud & AI",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#FF0000">
        <path d="M13.966 22H24V2h-5.918l-4.116 11.205zm-3.932 0L.034 22H0V2h5.918zM8.995 10.978L12.012 3h.024l3.017 7.978z" />
      </svg>
    ),
  },
  {
    name: "Salesforce",
    category: "SaaS & Enterprise AI",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#00A1E0">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
    ),
  },
  {
    name: "Spotify",
    category: "Audio & Algorithmic Tech",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1DB954">
        <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.899 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.019zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141 C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.18-1.2-.18-1.38-.72-.18-.6.18-1.2.72-1.38 4.26-1.26 11.28-1.02 15.72 1.62.54.3.72 1.02.42 1.56-.3.42-1.02.6-1.56.3z" />
      </svg>
    ),
  },
  {
    name: "Stripe",
    category: "Fintech Infrastructure",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#635BFF">
        <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.763-1.444 2.227-1.444 1.802 0 3.973.715 5.518 1.611l.939-4.887c-1.748-.823-3.878-1.27-6.289-1.27-5.597 0-9.458 2.827-9.458 7.575 0 6.643 9.07 5.485 9.07 8.358 0 1.054-.913 1.579-2.548 1.579-2.224 0-4.827-.999-6.602-2.029l-1.002 5.011c1.942.999 4.674 1.548 7.378 1.548 5.86 0 9.878-2.735 9.878-7.575.001-7.147-9.755-5.698-9.755-8.588z" />
      </svg>
    ),
  },
  {
    name: "Oracle",
    category: "Database & Cloud",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#C74634">
        <path d="M16.4 12c0-2.4-1.9-4.3-4.4-4.3s-4.4 1.9-4.4 4.3 1.9 4.3 4.4 4.3 4.4-1.9 4.4-4.3zm5.6 0c0 5.5-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2s10 4.5 10 10z" />
      </svg>
    ),
  },
  {
    name: "IBM",
    category: "Enterprise Systems",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0530AD">
        <path d="M0 4h7v2H0V4zm0 4h7v2H0V8zm0 4h7v2H0v-2zm0 4h7v2H0v-2zm8.5-12h7v2h-7V4zm0 4h7v2h-7V8zm0 4h7v2h-7v-2zm0 4h7v2h-7v-2zm8.5-12H24v2h-7V4zm0 4H24v2h-7V8zm0 4H24v2h-7v-2zm0 4H24v2h-7v-2z" />
      </svg>
    ),
  },
  {
    name: "Intel",
    category: "Semiconductors",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0068B5">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm-2 16H8V8h2v8zm4 0h-2V8h2v8zm4 0h-2V8h2v8z" />
      </svg>
    ),
  },
  {
    name: "Cisco",
    category: "Networking & Security",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1BA0D7">
        <path d="M4 14h2v6H4v-6zm4-4h2v10H8V10zm4-6h2v16h-2V4zm4 4h2v12h-2V8zm4 6h2v6h-2v-6z" />
      </svg>
    ),
  },
  {
    name: "Atlassian",
    category: "Developer Tools",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0052CC">
        <path d="M6.71 12.14L11.89 2.5a.76.76 0 0 1 1.34 0l5.18 9.64a.76.76 0 0 1-.67 1.12H7.38a.76.76 0 0 1-.67-1.12zM12.5 15.5h-1a.5.5 0 0 0-.5.5v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V16a.5.5 0 0 0-.5-.5z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    category: "Professional Network",
    logoSvg: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.74a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    category: "Developer Platform",
    logoSvg: (
      <svg className="w-5 h-5 fill-slate-900 dark:fill-white" viewBox="0 0 24 24">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export function CompanyMarquee() {
  // Duplicate list to create a seamless infinite loop effect
  const marqueeList = [...COMPANIES, ...COMPANIES];

  return (
    <div className="w-full py-10 overflow-hidden bg-slate-50/60 dark:bg-slate-950/60 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center space-y-1">
        <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Trusted by engineers & candidates hired at 20+ top tech companies worldwide
        </p>
      </div>

      {/* Infinite Ticker Track */}
      <div className="relative w-full overflow-hidden group">
        {/* Left & Right Edge Fading Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent z-10 pointer-events-none" />

        {/* Marquee Motion Container */}
        <div className="flex gap-4 sm:gap-6 w-max animate-marquee group-hover:[animation-play-state:paused] py-2">
          {marqueeList.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-sky-500/50 dark:hover:border-sky-500/50 hover:scale-105 transition-all duration-200 shrink-0 cursor-default"
            >
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center">
                {company.logoSvg}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {company.name}
                </h4>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {company.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
