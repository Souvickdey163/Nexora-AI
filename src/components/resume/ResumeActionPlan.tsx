"use client";

import React, { useState } from "react";
import { CheckSquare, Square, ListCheck, Sparkles, CheckCircle2 } from "lucide-react";

export interface ActionTask {
  id: string;
  title: string;
  category: "Metrics" | "Keywords" | "Formatting" | "Summary";
  impact: "+4 pts" | "+6 pts" | "+8 pts" | "+10 pts";
  isCompleted: boolean;
}

const INITIAL_TASKS: ActionTask[] = [
  {
    id: "task-1",
    title: "Add measurable metrics (e.g. 40% latency reduction, $120K saved) to Work Experience",
    category: "Metrics",
    impact: "+10 pts",
    isCompleted: false,
  },
  {
    id: "task-2",
    title: "Insert missing target role keywords (GraphQL, Docker, Jest, CI/CD)",
    category: "Keywords",
    impact: "+8 pts",
    isCompleted: false,
  },
  {
    id: "task-3",
    title: "Improve Professional Summary with technical specialization focus",
    category: "Summary",
    impact: "+6 pts",
    isCompleted: false,
  },
  {
    id: "task-4",
    title: "Fix date formatting across all company entries for ATS timeline parsing",
    category: "Formatting",
    impact: "+4 pts",
    isCompleted: false,
  },
  {
    id: "task-5",
    title: "Remove graphic rating bars and non-standard tables from PDF layout",
    category: "Formatting",
    impact: "+4 pts",
    isCompleted: true,
  },
];

export function ResumeActionPlan() {
  const [tasks, setTasks] = useState<ActionTask[]>(INITIAL_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isCompleted: !t.isCompleted } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ListCheck className="w-5 h-5 text-sky-500" />
            <span>Prioritized Action Plan</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Step-by-step checklist to elevate your ATS score from 84 to 95+
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {completedCount} of {tasks.length} Done
            </span>
            <span className="text-[10px] text-slate-500 block">{progressPercent}% Completed</span>
          </div>
          <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-500 font-extrabold text-xs flex items-center justify-center">
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Action Plan Tasks List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
              task.isCompleted
                ? "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200/50 dark:border-slate-800/50 opacity-60"
                : "bg-slate-50 dark:bg-slate-950/60 border-slate-200/90 dark:border-slate-800 hover:border-sky-500/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                className="mt-0.5 text-sky-500 hover:scale-110 transition-transform"
              >
                {task.isCompleted ? (
                  <CheckSquare className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400" />
                )}
              </button>
              <span
                className={`text-xs font-medium ${
                  task.isCompleted
                    ? "line-through text-slate-400 dark:text-slate-500"
                    : "text-slate-800 dark:text-slate-200"
                }`}
              >
                {task.title}
              </span>
            </div>

            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold shrink-0">
              {task.impact}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
