"use client";

import React from "react";
import Link from "next/link";
import { FEATURES } from "@/data/features";
import { ArrowRight, Sparkles } from "lucide-react";

interface FeaturesMegaMenuProps {
  onClose?: () => void;
}

export function FeaturesMegaMenu({ onClose }: FeaturesMegaMenuProps) {
  return (
    <div
      className="w-[860px] max-w-[90vw] p-6 bg-slate-900/95 dark:bg-slate-950/95 bg-white/95 backdrop-blur-xl rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl shadow-slate-950/20 text-slate-900 dark:text-slate-100 transition-all duration-200"
      role="menu"
      aria-orientation="vertical"
    >
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Nexora Intelligence Platform</span>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          10 Core Career Tools
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto pr-1">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.id}
              href={feature.href}
              onClick={onClose}
              className="group flex items-start gap-3.5 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
              role="menuitem"
            >
              <div className="p-2.5 rounded-lg bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-200 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors flex items-center gap-1.5">
                    {feature.title}
                    {feature.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-300">
                        {feature.badge}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 -mx-6 -mb-6 p-4 rounded-b-2xl">
        <span>Ready to explore all tools in one unified dashboard?</span>
        <Link
          href="/dashboard"
          onClick={onClose}
          className="font-medium text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          Open App Dashboard &rarr;
        </Link>
      </div>
    </div>
  );
}
