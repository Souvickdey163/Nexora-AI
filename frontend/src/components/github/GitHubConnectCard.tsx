"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Lock, Code2, Sparkles } from "lucide-react";

interface GitHubConnectCardProps {
  onConnect: (username: string) => Promise<void>;
  loading: boolean;
}

export function GitHubConnectCard({ onConnect, loading }: GitHubConnectCardProps) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onConnect(username.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/40 dark:shadow-slate-950/50 space-y-8 text-center"
    >
      {/* GitHub Brand Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-slate-950 dark:bg-slate-800 border border-slate-800 flex items-center justify-center mx-auto text-white shadow-lg shadow-slate-950/20">
        <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </div>

      {/* Hero Header Text */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold border border-sky-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-world Code Analysis</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Connect Your GitHub Profile
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Analyze your repositories, engineering practices, and project experience using evidence from your actual GitHub profile.
        </p>
      </div>

      {/* Connect Form */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto pt-2">
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            GitHub Username or Handle
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-mono text-xs select-none">
              github.com/
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
              required
              className="w-full pl-28 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !username.trim()}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-md shadow-sky-600/20 hover:shadow-sky-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500/50 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Fetching GitHub Data...</span>
            </div>
          ) : (
            <>
              <span>Connect GitHub Profile</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Security Guarantees */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-6 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span><strong>Public API Data Only:</strong> No secret keys or private access needed. Uses official GitHub REST APIs.</span>
        </div>
        <div className="flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
          <span><strong>Automatic Secret Exclusion:</strong> Config files like .env and credentials are stripped before analysis.</span>
        </div>
      </div>
    </motion.div>
  );
}
