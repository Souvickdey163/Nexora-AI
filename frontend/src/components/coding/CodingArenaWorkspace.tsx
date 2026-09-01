"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Cpu,
  FileCode2,
  Layers,
  Terminal,
  Filter,
} from "lucide-react";

interface Problem {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  initialCode: Record<string, string>;
}

const PROBLEMS: Problem[] = [
  {
    id: "two-sum-ii",
    title: "1. Two Sum II - Input Array Is Sorted",
    difficulty: "Medium",
    topic: "Arrays & Two Pointers",
    description:
      "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number.",
    examples: [
      {
        input: "numbers = [2,7,11,15], target = 9",
        output: "[1,2]",
        explanation: "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].",
      },
      {
        input: "numbers = [2,3,4], target = 6",
        output: "[1,3]",
      },
    ],
    constraints: [
      "2 <= numbers.length <= 3 * 10^4",
      "-1000 <= numbers[i] <= 1000",
      "numbers is sorted in non-decreasing order.",
      "-1000 <= target <= 1000",
      "The tests are generated such that there is exactly one solution.",
    ],
    initialCode: {
      javascript: `function twoSum(numbers, target) {\n    let left = 0;\n    let right = numbers.length - 1;\n    \n    while (left < right) {\n        const sum = numbers[left] + numbers[right];\n        if (sum === target) {\n            return [left + 1, right + 1];\n        } else if (sum < target) {\n            left++;\n        } else {\n            right--;\n        }\n    }\n    return [];\n}`,
      python: `def twoSum(numbers: List[int], target: int) -> List[int]:\n    left, right = 0, len(numbers) - 1\n    while left < right:\n        s = numbers[left] + numbers[right]\n        if s == target:\n            return [left + 1, right + 1]\n        elif s < target:\n            left += 1\n        else:\n            right -= 1\n    return []`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        int left = 0, right = numbers.size() - 1;\n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) return {left + 1, right + 1};\n            if (sum < target) left++;\n            else right--;\n        }\n        return {};\n    }\n};`,
      java: `class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int left = 0, right = numbers.length - 1;\n        while (left < right) {\n            int sum = numbers[left] + numbers[right];\n            if (sum == target) return new int[]{left + 1, right + 1};\n            if (sum < target) left++;\n            else right--;\n        }\n        return new int[]{};\n    }\n}`,
    },
  },
];

export function CodingArenaWorkspace() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "cpp" | "java">("javascript");
  const [code, setCode] = useState(selectedProblem.initialCode[language] || "");
  const [activeTab, setActiveTab] = useState<"testcases" | "output" | "ai_review">("output");
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: "Accepted" | "Wrong Answer" | "Idle";
    runtime?: string;
    memory?: string;
    passedCases?: number;
    totalCases?: number;
  }>({ status: "Idle" });

  const handleLanguageChange = (newLang: any) => {
    setLanguage(newLang);
    setCode(selectedProblem.initialCode[newLang] || "");
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: "Accepted",
        runtime: "42 ms (Beats 91.4%)",
        memory: "44.2 MB (Beats 88.2%)",
        passedCases: 3,
        totalCases: 3,
      });
      setActiveTab("output");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Problem Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Badge variant="amber" icon={Code2}>
            DSA Practice Arena
          </Badge>
          <span className="text-xs font-semibold text-slate-500">
            Topic: {selectedProblem.topic}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
          >
            <option value="javascript">JavaScript (Node.js v20)</option>
            <option value="python">Python 3.11</option>
            <option value="cpp">C++ 20 (GCC)</option>
            <option value="java">Java 21 (OpenJDK)</option>
          </select>

          <GlowButton onClick={handleRunCode} loading={isRunning} icon={Play} size="sm" variant="outline">
            Run Code
          </GlowButton>
          <GlowButton onClick={handleRunCode} loading={isRunning} icon={Send} size="sm">
            Submit Solution
          </GlowButton>
        </div>
      </div>

      {/* Main 3-Column IDE Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* LEFT COLUMN: Problem Description & Constraints */}
        <div className="lg:col-span-4 space-y-4 max-h-[700px] overflow-y-auto pr-1">
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                {selectedProblem.title}
              </h3>
              <Badge variant={selectedProblem.difficulty === "Easy" ? "emerald" : "amber"}>
                {selectedProblem.difficulty}
              </Badge>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>{selectedProblem.description}</p>
            </div>

            {/* Examples */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Examples
              </h4>
              {selectedProblem.examples.map((ex, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 font-mono text-[11px] space-y-1">
                  <div>
                    <span className="text-sky-500 font-bold">Input:</span> {ex.input}
                  </div>
                  <div>
                    <span className="text-emerald-500 font-bold">Output:</span> {ex.output}
                  </div>
                  {ex.explanation && (
                    <div className="text-slate-400 font-sans pt-1 text-[11px]">
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Constraints
              </h4>
              <ul className="space-y-1 font-mono text-[11px] text-slate-500">
                {selectedProblem.constraints.map((c, i) => (
                  <li key={i}>• {c}</li>
                ))}
              </ul>
            </div>
          </GlassCard>
        </div>

        {/* CENTER & RIGHT COLUMN: Code Editor & Execution Results */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Code Editor Container */}
          <GlassCard className="flex-1 p-0 overflow-hidden flex flex-col border-slate-800 bg-slate-950 text-slate-100">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-400">
                <FileCode2 className="w-4 h-4 text-sky-400" />
                <span>solution.{language === "python" ? "py" : language === "cpp" ? "cpp" : language === "java" ? "java" : "js"}</span>
              </div>
              <button
                onClick={() => setCode(selectedProblem.initialCode[language])}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Code</span>
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full flex-1 min-h-[360px] p-4 bg-slate-950 text-sky-300 font-mono text-xs leading-relaxed focus:outline-none resize-none"
              spellCheck={false}
            />
          </GlassCard>

          {/* Bottom Results & AI Review Panel */}
          <GlassCard className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("output")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                    activeTab === "output"
                      ? "bg-sky-500/10 text-sky-500"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Console & Test Output
                </button>
                <button
                  onClick={() => setActiveTab("ai_review")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    activeTab === "ai_review"
                      ? "bg-indigo-500/10 text-indigo-500"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Code Review</span>
                </button>
              </div>

              {executionResult.status !== "Idle" && (
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {executionResult.status} ({executionResult.passedCases}/{executionResult.totalCases} Passed)
                  </span>
                  <span className="text-slate-400">Runtime: {executionResult.runtime}</span>
                </div>
              )}
            </div>

            {activeTab === "output" && (
              <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-300 space-y-1 min-h-[90px]">
                {executionResult.status === "Idle" ? (
                  <p className="text-slate-500 italic">Click &quot;Run Code&quot; or &quot;Submit Solution&quot; to test your implementation.</p>
                ) : (
                  <>
                    <p className="text-emerald-400 font-bold">✓ Test Case 1 Passed: [2, 7, 11, 15], target = 9 =&gt; [1, 2]</p>
                    <p className="text-emerald-400 font-bold">✓ Test Case 2 Passed: [2, 3, 4], target = 6 =&gt; [1, 3]</p>
                    <p className="text-emerald-400 font-bold">✓ Test Case 3 Passed: [-1, 0], target = -1 =&gt; [1, 2]</p>
                  </>
                )}
              </div>
            )}

            {activeTab === "ai_review" && (
              <div className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                    <span className="font-bold text-sky-500">Time Complexity:</span>
                    <p className="font-mono text-[11px] text-slate-900 dark:text-white">O(N) - Two Pointer Single Pass</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 space-y-1">
                    <span className="font-bold text-emerald-500">Space Complexity:</span>
                    <p className="font-mono text-[11px] text-slate-900 dark:text-white">O(1) - Constant Extra Memory</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-1">
                  <span className="font-bold text-sky-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Code Optimization Assessment:
                  </span>
                  <p>
                    Your two-pointer approach is optimal! It takes advantage of the sorted array property to find the target sum in linear O(N) time without requiring auxiliary hash map memory.
                  </p>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
