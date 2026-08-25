"use client";

import React from "react";
import { Search, Sparkles, User, ChevronDown, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";

export function DashboardHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-16 bg-slate-900 text-slate-100 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-md">
      
      {/* Global Command Search Bar */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search jobs, resume tools, coding questions, docs..."
            className="w-full pl-10 pr-16 py-2 rounded-full bg-slate-950/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
          />
          <div className="absolute right-3 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            Cmd K
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 ml-auto">
        
        {/* Upgrade to Pro Button */}
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Upgrade to Premium</span>
        </button>

        {/* Notifications Icon */}
        <button
          type="button"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-sky-400 absolute top-1.5 right-1.5 animate-ping" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center font-bold text-xs">
            SD
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-white leading-tight">Souvick Dey</div>
            <div className="text-[10px] text-sky-400 font-medium">Pro Candidate</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

      </div>

    </header>
  );
}
