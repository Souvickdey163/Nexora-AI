"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FEATURES } from "@/data/features";
import { ChevronDown, X, Sparkles, ArrowRight } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NexoraLogo } from "@/components/common/Logo";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [featuresOpen, setFeaturesOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl transition-transform duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
            <div onClick={onClose}>
              <NexoraLogo size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="py-6 space-y-2">
            <Link
              href="/"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Home
            </Link>

            {/* Features Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-500" />
                  Features
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    featuresOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {featuresOpen && (
                <div className="mt-2 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-800 space-y-1">
                  {FEATURES.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <Link
                        key={feature.id}
                        href={feature.href}
                        onClick={onClose}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/40"
                      >
                        <Icon className="w-3.5 h-3.5 text-sky-500" />
                        <span>{feature.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Premium
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className="block px-3 py-2.5 rounded-lg font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Bottom CTA */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <Link
            href="/auth"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-sky-500/25 hover:opacity-95 transition-opacity"
          >
            <span>Sign In / Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
