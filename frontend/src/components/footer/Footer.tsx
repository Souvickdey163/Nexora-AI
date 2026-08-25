"use client";

import React from "react";
import Link from "next/link";
import { NexoraLogo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Column 1: Brand & Bio */}
          <div className="col-span-2 space-y-4 pr-4">
            <NexoraLogo size="md" variant="light" />
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Your AI Career Copilot. An all-in-one AI career intelligence platform for resumes, mock interviews, coding challenges, GitHub analysis, and placement readiness.
            </p>
          </div>

          {/* Column 2: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/resume" className="hover:text-white transition-colors">
                  Resume Intelligence
                </Link>
              </li>
              <li>
                <Link href="/interview" className="hover:text-white transition-colors">
                  Mock Interview
                </Link>
              </li>
              <li>
                <Link href="/coding" className="hover:text-white transition-colors">
                  Coding Arena
                </Link>
              </li>
              <li>
                <Link href="/mentor" className="hover:text-white transition-colors">
                  Career Mentor
                </Link>
              </li>
              <li>
                <Link href="/github" className="hover:text-white transition-colors">
                  GitHub Intelligence
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Career */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Career
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/analytics" className="hover:text-white transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Roadmap
                </Link>
              </li>
              <li>
                <Link href="/placement" className="hover:text-white transition-colors">
                  Placement Intelligence
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Skill Assessment
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-white transition-colors">
                  Learning Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Resources & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Nexora AI. All rights reserved.</p>
          <p className="text-slate-400">
            Engineered for high-performance career growth.
          </p>
        </div>
      </div>
    </footer>
  );
}
