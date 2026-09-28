"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

export const AboutFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "What is Nexora AI?",
      a: "Nexora AI is an all-in-one AI career copilot designed for students, job seekers, and early-career developers. It brings together resume intelligence, coding challenges, AI mock interviews, GitHub insights, career roadmaps, and job discovery into a unified platform.",
    },
    {
      q: "Who is Nexora AI for?",
      a: "Nexora AI is built for computer science students, boot camp graduates, self-taught developers, and early-career software engineers who want to prepare effectively for technical hiring processes and land software engineering roles.",
    },
    {
      q: "What can Nexora AI help me with?",
      a: "Nexora helps you optimize your resume for ATS systems, practice algorithmic coding challenges, perform AI-driven mock interviews, analyze your GitHub portfolio, identify skill gaps, and discover relevant job opportunities matching your target role.",
    },
    {
      q: "Can Nexora analyze my resume?",
      a: "Yes. Nexora's Resume Intelligence module parses uploaded PDF or DOCX resumes, extracts key skills, work experience, and education, benchmarks keyword alignment against ATS systems, and delivers actionable AI recommendations for improvement.",
    },
    {
      q: "Can Nexora help me prepare for interviews?",
      a: "Yes. Nexora features an AI Mock Interview workspace offering technical QuizAPI MCQs, behavioral STAR answer evaluations, and interactive interview simulations with dynamic feedback on answer depth and role suitability.",
    },
    {
      q: "Can I practice coding on Nexora?",
      a: "Yes. Nexora includes a dedicated Coding Arena supporting multiple programming languages (Python, TypeScript, JavaScript, Java, C++). You can execute code live, pass test cases, and track your problem-solving progress.",
    },
    {
      q: "Can Nexora analyze my GitHub profile?",
      a: "Yes. Nexora's GitHub Intelligence module connects to your public GitHub profile to evaluate repository code quality, tech stack usage, commit history, and project complexity to generate portfolio insights.",
    },
    {
      q: "How does Nexora protect my data?",
      a: "Nexora implements robust security controls including JWT session authentication, bcrypt password hashing, Zod payload validation, Express rate-limiting, Helmet security headers, and strict server-side isolation for all API keys.",
    },
    {
      q: "Is Nexora AI free?",
      a: "Nexora provides free initial AI credits upon registration to explore resume parsing, coding arena, mock interviews, and AI mentor conversations. Flexible credit packages and subscription plans are available for extended practice.",
    },
    {
      q: "How can I get started?",
      a: "You can create a free account in seconds by navigating to our Sign Up page. Once registered, define your target career role, upload your resume, and start practicing in the AI modules right away.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>GOT QUESTIONS?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Questions</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Everything you need to know about Nexora AI and how it transforms career preparation.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white focus:outline-none focus:text-cyan-300"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-indigo-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-cyan-400" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-400 leading-relaxed border-t border-slate-900">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
