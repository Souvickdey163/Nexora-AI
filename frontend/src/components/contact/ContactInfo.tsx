"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Wrench, Briefcase, ShieldCheck } from "lucide-react";

export const ContactInfo: React.FC = () => {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@nexora.ai";
  const technicalEmail = process.env.NEXT_PUBLIC_TECHNICAL_EMAIL || "tech@nexora.ai";
  const businessEmail = process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "partnerships@nexora.ai";

  const cards = [
    {
      title: "Customer Support",
      desc: "For general inquiries, account assistance, resume parsing, and platform guidance.",
      email: supportEmail,
      icon: Mail,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-cyan-400",
    },
    {
      title: "Technical Support",
      desc: "For reporting bugs, API errors, code execution issues, or security concerns.",
      email: technicalEmail,
      icon: Wrench,
      color: "from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-400",
    },
    {
      title: "Business & Partnerships",
      desc: "For university placements, enterprise recruiting partnerships, and media inquiries.",
      email: businessEmail,
      icon: Briefcase,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>DIRECT CHANNELS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Support <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Channels</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Reach out directly to our dedicated customer, technical, and business teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, idx) => {
            const IconComp = c.icon;
            return (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br border ${c.color} flex items-center justify-center`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white">{c.title}</h3>

                  <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-900">
                  <a
                    href={`mailto:${c.email}`}
                    className="text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition break-all"
                  >
                    {c.email}
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
