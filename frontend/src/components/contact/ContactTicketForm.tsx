"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  FileText,
  User,
  Mail,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supportApi, SupportTicketItem } from "@/lib/api/support";

interface ContactTicketFormProps {
  selectedCategory: string;
  onTicketCreated: (ticket: SupportTicketItem) => void;
}

export const ContactTicketForm: React.FC<ContactTicketFormProps> = ({
  selectedCategory,
  onTicketCreated,
}) => {
  const { user, isLoggedIn } = useAuth();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [category, setCategory] = useState<string>("TECHNICAL_ISSUE");
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [subject, setSubject] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [attachmentUrl, setAttachmentUrl] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [createdTicket, setCreatedTicket] = useState<SupportTicketItem | null>(null);

  // Sync category prop when selected from category cards
  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory);
    }
  }, [selectedCategory]);

  // Autofill user name & email when authenticated
  useEffect(() => {
    if (user) {
      const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      if (fullName) setName(fullName);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required.";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = "Valid email address is required.";
    if (!category) errs.category = "Please select a category.";
    if (!subject.trim() || subject.trim().length < 3) errs.subject = "Subject must be at least 3 characters.";
    if (!description.trim() || description.trim().length < 10) errs.description = "Description must be at least 10 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError(null);

    if (!isLoggedIn) {
      setGlobalError("Please sign in to submit a support ticket.");
      return;
    }

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await supportApi.createTicket({
        name,
        email,
        category,
        priority,
        subject,
        description,
        attachmentUrl: attachmentUrl.trim() || undefined,
      });

      if (res.success && res.data?.ticket) {
        setCreatedTicket(res.data.ticket);
        onTicketCreated(res.data.ticket);
        // Reset form details for next request
        setSubject("");
        setDescription("");
        setAttachmentUrl("");
        setErrors({});
      } else {
        setGlobalError(res.error || "Failed to create support request. Please try again.");
      }
    } catch (err: any) {
      setGlobalError(err.message || "An error occurred while submitting your ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    { value: "ACCOUNT_AUTH", label: "Account & Authentication" },
    { value: "RESUME_INTELLIGENCE", label: "Resume Intelligence" },
    { value: "MOCK_INTERVIEW", label: "Mock Interview" },
    { value: "CODING_ARENA", label: "Coding Arena" },
    { value: "PAYMENTS_CREDITS", label: "Payments & Credits" },
    { value: "CAREER_INTELLIGENCE", label: "Career Intelligence" },
    { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
    { value: "GENERAL_FEEDBACK", label: "General Feedback" },
    { value: "OTHER", label: "Other" },
  ];

  const priorities = [
    { value: "LOW", label: "Low Priority" },
    { value: "MEDIUM", label: "Medium Priority" },
    { value: "HIGH", label: "High Priority" },
    { value: "CRITICAL", label: "Critical Priority" },
  ];

  return (
    <section id="support-form" className="py-20 lg:py-28 bg-slate-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>SUBMIT SUPPORT REQUEST</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Create a <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Support Request</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400">
            Fill in the details below. Authenticated requests are tracked directly in your account dashboard.
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl shadow-2xl">
          {/* Global Error Banner */}
          {globalError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{globalError}</span>
            </div>
          )}

          {/* Success Card State */}
          {createdTicket ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">Support request created</h3>
                <p className="text-xs text-slate-400">
                  Your ticket has been logged in PostgreSQL and a confirmation email has been dispatched.
                </p>
              </div>

              {/* Ticket Details Grid */}
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-left max-w-lg mx-auto space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Ticket ID:</span>
                  <span className="text-cyan-400 font-extrabold">{createdTicket.ticketNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Subject:</span>
                  <span className="text-white font-semibold truncate max-w-[220px]">{createdTicket.subject}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-200">{createdTicket.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Priority:</span>
                  <span className="text-amber-400 font-bold">{createdTicket.priority}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400 font-bold">{createdTicket.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Created Date:</span>
                  <span className="text-slate-300">{new Date(createdTicket.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => setCreatedTicket(null)}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition"
                >
                  Create Another Request
                </button>
                <a
                  href="#my-tickets"
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition"
                >
                  View My Tickets Below
                </a>
              </div>
            </motion.div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLoggedIn && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-3">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>
                    You are currently logged out. Please <a href="/auth" className="underline font-bold">Sign In</a> to submit and track your support tickets.
                  </span>
                </div>
              )}

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={!isLoggedIn || submitting}
                    className={`w-full bg-slate-950 border ${
                      errors.name ? "border-rose-500" : "border-slate-800"
                    } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition disabled:opacity-60`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-400">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    disabled={!isLoggedIn || submitting}
                    className={`w-full bg-slate-950 border ${
                      errors.email ? "border-rose-500" : "border-slate-800"
                    } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition disabled:opacity-60`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-400">{errors.email}</p>}
                </div>
              </div>

              {/* Category & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!isLoggedIn || submitting}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Priority</span>
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    disabled={!isLoggedIn || submitting}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                  >
                    {priorities.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief summary of your question or problem..."
                  disabled={!isLoggedIn || submitting}
                  className={`w-full bg-slate-950 border ${
                    errors.subject ? "border-rose-500" : "border-slate-800"
                  } rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition`}
                />
                {errors.subject && <p className="text-[11px] text-rose-400">{errors.subject}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide details about what happened, steps to reproduce, or your exact question..."
                  disabled={!isLoggedIn || submitting}
                  className={`w-full bg-slate-950 border ${
                    errors.description ? "border-rose-500" : "border-slate-800"
                  } rounded-xl p-4 text-sm text-white focus:outline-none focus:border-cyan-400 transition`}
                />
                {errors.description && <p className="text-[11px] text-rose-400">{errors.description}</p>}
              </div>

              {/* Optional Attachment URL */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>Optional Attachment URL / Screenshot Link</span>
                  <span className="text-slate-500 font-normal">Optional</span>
                </label>
                <input
                  type="url"
                  value={attachmentUrl}
                  onChange={(e) => setAttachmentUrl(e.target.value)}
                  placeholder="https://..."
                  disabled={!isLoggedIn || submitting}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400 transition"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isLoggedIn || submitting}
                  className="w-full py-4 px-8 bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 disabled:opacity-50 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting Support Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
