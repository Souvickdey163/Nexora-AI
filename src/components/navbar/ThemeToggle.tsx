"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500/50"
      aria-label="Toggle Dark and Light theme"
      title={`Switch to ${resolvedTheme === "dark" ? "Light" : "Dark"} Mode`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 dark:text-slate-300 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
