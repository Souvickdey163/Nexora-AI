"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  LifeBuoy,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface ContactHeroProps {
  activeTicketsCount: number;
  isLoggedIn: boolean;
  onScrollToForm: () => void;
  onScrollToFaq: () => void;
}

export const ContactHero: React.FC<ContactHeroProps> = ({
  activeTicketsCount,
  isLoggedIn,
  onScrollToForm,
  onScrollToFaq,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-slate-950 text-white">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wider uppercase text-cyan-300">
                GET IN TOUCH
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
              Contact & <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Support</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl font-semibold text-slate-200 leading-snug">
              Have questions, found an issue, or need help with Nexora? Our support team is here to help.
            </p>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Whether you need assistance with account authentication, resume parsing, AI mock interview evaluations, coding challenge submissions, payments, credits, or technical platform questions, we&apos;re dedicated to ensuring a seamless experience.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={onScrollToForm}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <LifeBuoy className="w-5 h-5 text-cyan-200" />
                <span>Create Support Ticket</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToFaq}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Browse FAQs</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Support Status Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <LifeBuoy className="w-5 h-5 animate-spin" style={{ animationDuration: "12s" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Support Center</h3>
                    <p className="text-[11px] text-slate-400">Nexora Customer Care</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>

              {/* Status details */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Target Response Time</p>
                      <p className="text-[11px] text-slate-400">Usually within 24 hours</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-400 font-bold">24H SLAs</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-white">Your Support Requests</p>
                      <p className="text-[11px] text-slate-400">
                        {isLoggedIn
                          ? activeTicketsCount > 0
                            ? `${activeTicketsCount} open or pending ticket(s)`
                            : "No active requests"
                          : "Sign in to view your tickets"}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-indigo-400 font-bold">
                    {isLoggedIn ? `${activeTicketsCount} Active` : "Guest"}
                  </span>
                </div>
              </div>

              {/* Security info */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Encrypted Ticket Logs
                </span>
                <span className="text-cyan-400 font-medium">PostgreSQL Persistence</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
