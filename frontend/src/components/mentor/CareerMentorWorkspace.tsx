"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import { ProgressRing } from "@/components/ui/ProgressRing";
import {
  BrainCircuit,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Bookmark,
  User,
  Target,
  Award,
  BookOpen,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "mentor";
  text: string;
  timestamp: string;
  category?: string;
}

export function CareerMentorWorkspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "mentor",
      text: "Hello Souvick! I'm your Nexora AI Career Mentor. I've reviewed your current profile target for Senior Full Stack Engineer. How can I help guide your career progression today?",
      timestamp: "10:30 AM",
      category: "Welcome",
    },
    {
      id: "2",
      sender: "user",
      text: "What skills should I prioritize next to transition from Full Stack Engineer to Staff Architect?",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      sender: "mentor",
      text: "To bridge the gap between Full Stack Engineer and Staff Architect, prioritize these 3 strategic pillars:\n\n1. **Distributed System Design**: Master event-driven architectures (Kafka/RabbitMQ), caching layers (Redis cluster), and database sharding.\n2. **System Observability & Reliability**: Deepen knowledge in Prometheus, Grafana, OpenTelemetry, and zero-downtime CI/CD deployment pipelines.\n3. **Technical Leadership & RFC Writing**: Practice authoring architectural decision records (ADRs) and leading cross-team technical alignment.",
      timestamp: "10:33 AM",
      category: "Career Roadmap",
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedPrompts = [
    "How should I prepare for System Design interviews?",
    "Review my career roadmap for 2026",
    "What skills should I learn next for Staff Engineer?",
    "How can I optimize my resume for Tier-1 companies?",
    "Create a 4-week study plan for DSA & System Design",
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputPrompt;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputPrompt("");

    // Simulate Streaming AI Mentor response
    setTimeout(() => {
      const mentorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "mentor",
        text: `Based on your Nexora career analytics, here is your customized guidance regarding: "${query}"\n\nI recommend dedicating 5 hours weekly to System Design exercises and completing 2 portfolio projects demonstrating event-driven microservices.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        category: "AI Advice",
      };
      setMessages((prev) => [...prev, mentorMsg]);
    }, 800);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[650px]">
      {/* LEFT COLUMN: Conversation Threads & History */}
      <div className="lg:col-span-3 space-y-4">
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Mentor Threads
            </span>
            <Badge variant="sky">Active</Badge>
          </div>

          <div className="space-y-2">
            <button className="w-full text-left p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-xs font-bold text-sky-600 dark:text-sky-400 flex items-center justify-between">
              <span className="truncate">Staff Architect Path</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between transition-colors">
              <span className="truncate">Resume Bullet Review</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between transition-colors">
              <span className="truncate">System Design Study Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </GlassCard>
      </div>

      {/* CENTER COLUMN: Interactive Chat Interface */}
      <div className="lg:col-span-6 flex flex-col space-y-4">
        <GlassCard className="flex-1 flex flex-col p-4 min-h-[480px]">
          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400">
                    {msg.sender === "user" ? "You" : "Nexora AI Mentor"} • {msg.timestamp}
                  </span>
                </div>
                <div
                  className={`p-4 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-none shadow-md"
                      : "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.sender === "mentor" && (
                    <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-500">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="hover:text-sky-500 flex items-center gap-1"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Prompts Pill Cloud */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Suggested Career Prompts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-500/10 hover:text-sky-500 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2 pt-3">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask your career mentor anything..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <GlowButton onClick={() => handleSendMessage()} icon={Send} size="sm">
              Ask
            </GlowButton>
          </div>
        </GlassCard>
      </div>

      {/* RIGHT COLUMN: Career Context & Profile Panel */}
      <div className="lg:col-span-3 space-y-4">
        <GlassCard className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              SD
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Souvick Dey</h4>
              <p className="text-[11px] text-slate-500">Full Stack Engineer</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Target Role:</span>
              <span className="font-bold text-sky-500">Staff Architect</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Target Companies:</span>
              <span className="font-bold text-slate-900 dark:text-white">Tier-1 Tech</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Career Readiness:</span>
              <span className="font-bold text-emerald-500">88%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-center">
            <ProgressRing progress={88} size={110} sublabel="Readiness" color="sky" />
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
