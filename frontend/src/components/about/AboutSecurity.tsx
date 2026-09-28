"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  Key,
  Server,
  Database,
  FileCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export const AboutSecurity: React.FC = () => {
  const securityPillars = [
    {
      title: "Server-Side Secret Isolation",
      desc: "All API keys (Gemini, QuizAPI, Razorpay, SMTP) are strictly stored in server environment variables and never exposed to the client bundle.",
      icon: Key,
    },
    {
      title: "JWT Session Authentication",
      desc: "Stateful authentication via cryptographically signed JWT tokens and HTTP-only secure cookie transport.",
      icon: Lock,
    },
    {
      title: "Zod Payload Validation",
      desc: "Strict schema validation on incoming REST requests to prevent injection attacks and malformed data payloads.",
      icon: FileCheck,
    },
    {
      title: "Express Security Headers & Rate Limiting",
      desc: "Helmet protection against XSS, clickjacking, sniffing, and IP-based rate limiting to prevent brute-force attacks.",
      icon: Server,
    },
    {
      title: "Database Isolation & Clean Cascade",
      desc: "PostgreSQL queries guarded by Prisma ORM parameterized queries to block SQL injection completely.",
      icon: Database,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ENTERPRISE PRIVACY & SAFETY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Security Comes <span className="text-emerald-400">First</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Your candidate data, resumes, and code submissions are protected by production-grade security architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Security Features List */}
          <div className="lg:col-span-7 space-y-4">
            {securityPillars.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex items-start gap-4"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>{p.title}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Security Dashboard Graphic */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Security Status Monitor</h4>
                    <p className="text-[11px] text-slate-400">Nexora Guardian Middleware</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  PROTECTED
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Zero Client API Exposure</span>
                  <span className="text-emerald-400 font-bold">ACTIVE</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Helmet Security Headers</span>
                  <span className="text-emerald-400 font-bold">ENFORCED</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Rate Limiter Middleware</span>
                  <span className="text-emerald-400 font-bold">ENABLED</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">PostgreSQL Parameterized Queries</span>
                  <span className="text-emerald-400 font-bold">VERIFIED</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400 italic">
                  Nexora complies with standard data encryption and security protocols for user privacy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
