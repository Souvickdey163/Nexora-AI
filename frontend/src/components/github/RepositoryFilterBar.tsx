"use client";

import React from "react";
import { Search, X, Code2 } from "lucide-react";

interface RepositoryFilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  filter: string;
  setFilter: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  availableLanguages: string[];
}

export function RepositoryFilterBar({
  search,
  setSearch,
  filter,
  setFilter,
  language,
  setLanguage,
  availableLanguages,
}: RepositoryFilterBarProps) {
  const filterOptions = [
    "All",
    "Strong Evidence",
    "Moderate Evidence",
    "Limited Evidence",
    "Insufficient Evidence",
    "Starred",
    "Recently Updated",
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
      {/* Search Input */}
      <div className="relative w-full md:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories by name or tech..."
          className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors placeholder:text-slate-400"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto py-0.5">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => setFilter(opt)}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs whitespace-nowrap transition-all ${
              filter === opt
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Language Dropdown */}
      {availableLanguages.length > 0 && (
        <div className="flex items-center gap-2 shrink-0">
          <Code2 className="w-4 h-4 text-slate-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="All">All Languages</option>
            {availableLanguages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
