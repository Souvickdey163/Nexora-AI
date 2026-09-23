"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitHubProfile } from "@/lib/api/github";
import { ExternalLink, RefreshCw, Unlink, CheckCircle2, MapPin, Link as LinkIcon } from "lucide-react";

interface GitHubProfileHeaderProps {
  profile: GitHubProfile;
  onRefresh: () => void;
  onDisconnect: () => void;
  syncing: boolean;
}

export function GitHubProfileHeader({
  profile,
  onRefresh,
  onDisconnect,
  syncing,
}: GitHubProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
    >
      <div className="flex items-start sm:items-center gap-5">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 shrink-0 shadow-sm">
          <img
            src={profile.avatarUrl || "https://github.com/identicons/octocat.png"}
            alt={profile.username}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Profile Details */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profile.name || profile.username}
            </h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Connected
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <a
              href={profile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              @{profile.username}
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span><strong>{profile.publicRepos}</strong> Public Repositories</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span><strong>{profile.followers}</strong> Followers</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span><strong>{profile.following}</strong> Following</span>
          </div>

          {profile.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 line-clamp-2 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
        <button
          type="button"
          onClick={onRefresh}
          disabled={syncing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-sky-500" : ""}`} />
          <span>Sync Data</span>
        </button>

        <button
          type="button"
          onClick={onDisconnect}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors border border-rose-500/20"
        >
          <Unlink className="w-3.5 h-3.5" />
          <span>Disconnect</span>
        </button>
      </div>
    </motion.div>
  );
}
