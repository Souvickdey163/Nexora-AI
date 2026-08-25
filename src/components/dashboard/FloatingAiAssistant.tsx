"use client";

import React, { useState } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  Zap,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    text: "Hi Souvick! I'm your Nexora AI Copilot 🤖. I can assist with resume optimization, mock interview prep, coding hints, or GitHub audit. How can I help you today?",
    timestamp: "Just now",
  },
];

const PROMPT_SUGGESTIONS = [
  "How to boost ATS score to 95+?",
  "Prepare for Senior React interview",
  "Review my GitHub code architecture",
  "Suggest action verbs for Work Experience",
];

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText =
        "Great question! Based on your current profile telemetry, adding measurable metrics (% latency reduction, $ saved) to your Work Experience will boost your ATS score by +8 points. Would you like me to rewrite a specific section?";

      if (text.includes("React") || text.includes("interview")) {
        aiResponseText =
          "For Senior React interviews, focus on custom hook performance, React Fiber reconciliation, Virtual DOM diffing, and micro-frontend state architecture. Try running an AI Voice Mock Interview!";
      } else if (text.includes("GitHub")) {
        aiResponseText =
          "Your GitHub analysis shows strong commit frequency. Adding explicit unit test coverage (Jest/Vitest) and CI/CD workflow manifests will elevate your repository grade to A+.";
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: aiResponseText,
        timestamp: "Just now",
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl overflow-hidden animate-fadeIn flex flex-col h-[460px]">
          
          {/* Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-sky-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Nexora AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <span className="text-[10px] text-sky-400 font-medium">Online 24/7 • Career Copilot</span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs scrollbar-thin">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-sky-500 text-white rounded-br-none font-medium shadow-md"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-800 text-slate-400 text-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin" />
                  <span>Nexora AI is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {PROMPT_SUGGESTIONS.map((p) => (
              <button
                key={p}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-sky-500/20 hover:border-sky-500/40 text-[10px] font-semibold text-slate-300 hover:text-sky-300 border border-slate-700/60 whitespace-nowrap transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask AI anything about your career..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 disabled:opacity-40 transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400 text-white font-extrabold text-xs shadow-2xl shadow-sky-500/40 hover:scale-105 transition-all duration-300 active:scale-95"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <span>AI Assistant</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>

    </div>
  );
}
