"use client";

import React from "react";
import { motion } from "framer-motion";
import { LifeBuoy, ArrowRight, Sparkles } from "lucide-react";

interface ContactFinalCTAProps {
  onScrollToForm: () => void;
}

export const ContactFinalCTA: React.FC<ContactFinalCTAProps> = ({ onScrollToForm }) => {
  return (
    <section className="py-20 lg:py-28 bg-slate-950 relative overflow-hidden">
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-gradient-to-r from-cyan-600/20 via-indigo-600/25 to-purple-600/20 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl bg-slate-900/80 p-8 sm:p-14 border border-indigo-500/30 text-center space-y-6 shadow-2xl backdrop-blur-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>WE ARE HERE TO HELP</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Still need <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">help?</span>
          </h2>

          <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create a support request and our team will review your ticket and get back to you promptly.
          </p>

          <div className="pt-2">
            <button
              onClick={onScrollToForm}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 inline-flex items-center gap-2 group text-sm"
            >
              <LifeBuoy className="w-5 h-5 text-cyan-200" />
              <span>Contact Support</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
