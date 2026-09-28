"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";

export const ContactFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      group: "Account & Authentication",
      q: "How do I create a Nexora account?",
      a: "You can create an account by clicking 'Get Started' or 'Sign Up' in the navbar. Simply fill in your name, email address, and desired password, or use Google/GitHub OAuth.",
    },
    {
      group: "Account & Authentication",
      q: "How does OTP verification work?",
      a: "When you sign up, Nexora dispatches a 6-digit verification code to your email address. Enter the code on the verification screen within 10 minutes to activate your account.",
    },
    {
      group: "Account & Authentication",
      q: "How can I reset my password?",
      a: "If you forgot your password, click 'Forgot Password?' on the Login page. We'll email you a password reset OTP code to securely set a new password.",
    },
    {
      group: "Resume Intelligence",
      q: "What is Resume Intelligence and how does ATS scoring work?",
      a: "Resume Intelligence parses your uploaded resume (PDF/DOCX), extracts skills, education, and experience, and benchmarks keyword alignment against ATS recruiters. It highlights missing keywords and provides section-by-section AI feedback.",
    },
    {
      group: "Resume Intelligence",
      q: "Which resume formats are supported?",
      a: "Nexora supports PDF (`.pdf`) and Microsoft Word (`.docx`) document uploads up to 10MB.",
    },
    {
      group: "Mock Interview",
      q: "How does the AI Mock Interview work?",
      a: "Nexora's AI Mock Interview generates dynamic technical, behavioral, and HR questions based on your target role and resume context. It evaluates your answers using STAR methodology criteria and returns detailed rubric scores.",
    },
    {
      group: "Mock Interview",
      q: "Can I select interview difficulty?",
      a: "Yes. You can select Easy (Junior Level), Medium (Mid Level), or Hard (Senior / Lead) difficulty before beginning any mock interview or technical quiz.",
    },
    {
      group: "Coding Arena",
      q: "How does Coding Arena work and which languages are supported?",
      a: "Coding Arena provides algorithmic challenges where you can write code, run against test cases, and submit solutions. Supported languages include Python, TypeScript, JavaScript, Java, and C++.",
    },
    {
      group: "Credits & Payments",
      q: "What are Nexora credits and how are they used?",
      a: "Credits power AI operations like resume parsing, AI mock interviews, and GitHub repository analysis. Every new account receives 10 free credits upon registration. Browsing, viewing reports, and reading roadmaps are always free.",
    },
    {
      group: "Credits & Payments",
      q: "What happens after my credits run out?",
      a: "When your credits run out, you can top up your balance by purchasing credit packages on our Pricing page. Purchased credits never expire.",
    },
    {
      group: "Support",
      q: "How long does support take to respond?",
      a: "Our support team usually reviews and responds to support tickets within 24 hours. Critical account or payment issues receive priority handling.",
    },
    {
      group: "Support",
      q: "How can I check my support request status?",
      a: "Logged-in users can view all their submitted support tickets, status updates, and support responses directly in the 'My Support Requests' section on this page.",
    },
  ];

  return (
    <section id="faq-section" className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>KNOWLEDGE BASE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Questions</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Find answers to common questions about accounts, resumes, mock interviews, coding arena, credits, and support.
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
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-semibold text-white focus:outline-none focus:text-cyan-300"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
                      {faq.group}
                    </span>
                    <span className="text-base sm:text-lg">{faq.q}</span>
                  </div>
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
                      <div className="px-6 pb-6 pt-1 text-sm text-slate-400 leading-relaxed border-t border-slate-800/80">
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
