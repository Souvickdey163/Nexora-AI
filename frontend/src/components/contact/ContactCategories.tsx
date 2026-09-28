"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  FileText,
  Video,
  Code2,
  CreditCard,
  Wrench,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

interface ContactCategoriesProps {
  onSelectCategory: (categoryValue: string) => void;
}

export const ContactCategories: React.FC<ContactCategoriesProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: "ACCOUNT_AUTH",
      title: "Account & Login",
      desc: "Problems with authentication, OTP, password reset, or your account.",
      icon: UserCheck,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-cyan-400",
    },
    {
      id: "RESUME_INTELLIGENCE",
      title: "Resume Intelligence",
      desc: "Questions about resume uploads, ATS analysis, parsing, or resume feedback.",
      icon: FileText,
      color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-300",
    },
    {
      id: "MOCK_INTERVIEW",
      title: "Mock Interviews",
      desc: "Issues with mock interviews, questions, evaluations, or interview sessions.",
      icon: Video,
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
    },
    {
      id: "CODING_ARENA",
      title: "Coding Arena",
      desc: "Problems with coding challenges, submissions, test cases, or execution.",
      icon: Code2,
      color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      id: "PAYMENTS_CREDITS",
      title: "Payments & Credits",
      desc: "Questions about subscriptions, credits, payments, refunds, or billing.",
      icon: CreditCard,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
    {
      id: "TECHNICAL_ISSUE",
      title: "Technical Issue",
      desc: "Something is not working correctly? Report a technical problem.",
      icon: Wrench,
      color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-400",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>SUPPORT CATEGORIES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How can we <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">help?</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Select a category below to automatically tailor your support ticket request.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => onSelectCategory(cat.id)}
                className="p-6 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 group cursor-pointer hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-br border ${cat.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="pt-2 text-[11px] font-bold text-indigo-400 group-hover:text-cyan-400 flex items-center gap-1 transition-colors">
                  <span>Preselect & Create Request</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
