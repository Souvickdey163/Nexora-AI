"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const AboutFinalCTA: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const primaryHref = isLoggedIn ? "/dashboard" : "/auth";

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById("features");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden">
      {/* Background glow & gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-r from-cyan-600/20 via-indigo-600/25 to-purple-600/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-14 border border-indigo-500/30 text-center space-y-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>START PREPARING TODAY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
            Your Career Journey Starts With <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">One Step</span>.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Build your profile, understand your strengths, practice your skills, and prepare for the opportunities ahead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={primaryHref}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group text-base"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#features"
              onClick={scrollToFeatures}
              className="w-full sm:w-auto px-8 py-4 bg-slate-950/80 hover:bg-slate-900 text-slate-200 hover:text-white font-semibold rounded-2xl border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-md text-base"
            >
              <Compass className="w-5 h-5 text-indigo-400" />
              <span>Explore Features</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
