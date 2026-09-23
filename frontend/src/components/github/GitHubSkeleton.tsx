"use client";

import React from "react";
import { motion } from "framer-motion";

export function GitHubSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Profile Header Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0" />
          <div className="space-y-2 w-full max-w-sm">
            <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-36 bg-slate-200 dark:bg-slate-800 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        </div>
      </div>

      {/* Summary Stats Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-8 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
            <div className="h-3 w-36 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        ))}
      </div>

      {/* Alignment Card Skeleton */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="h-5 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4" />
          ))}
        </div>
      </div>

      {/* Repository Filter Bar Skeleton */}
      <div className="h-14 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl" />

      {/* Repository Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 h-52 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-md" />
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-3 w-2/3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="h-8 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
