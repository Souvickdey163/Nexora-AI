"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Plus,
  Copy,
  Check,
  AlertTriangle,
  Bot,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mentorApi, MentorConversationDTO, MentorMessageDTO } from "@/lib/api/mentor";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

const PROMPT_SUGGESTIONS = [
  "Create a 3-month DSA roadmap for campus placements",
  "Explain Java OOP concepts with placement examples",
  "How to boost ATS score to 95+?",
  "Review my GitHub architecture",
];

const LOCAL_STORAGE_CONV_KEY = "nexus_ai_active_conversation_id";

export function FloatingAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const userGreeting = user?.firstName ? `Hi ${user.firstName}!` : "Hi there!";

  // Conversation & Messages state
  const [conversations, setConversations] = useState<MentorConversationDTO[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MentorMessageDTO[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getWelcomeMessage = (): MentorMessageDTO => ({
    id: "welcome-nexus-0",
    conversationId: "",
    role: "ASSISTANT",
    content: `${userGreeting} I'm **Nexus AI** ⚡ — your personal AI career copilot.\n\nI can help you with:\n- **DSA & Problem Solving** roadmaps\n- **System Design & Core CS** explanations\n- **ATS Resume Optimization** & bullet points\n- **Mock Interview Prep** strategies\n\nHow can I help guide your engineering career today?`,
    createdAt: new Date().toISOString(),
  });

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen]);

  // Load chat threads when user opens widget or logs in
  useEffect(() => {
    if (user && isOpen && conversations.length === 0) {
      loadHistory();
    }
  }, [user, isOpen]);

  const loadHistory = async () => {
    setIsLoadingHistory(true);
    setErrorMessage(null);

    const res = await mentorApi.listConversations();
    if (res.success && res.data) {
      setConversations(res.data);
      const savedConvId = localStorage.getItem(LOCAL_STORAGE_CONV_KEY);

      if (savedConvId && res.data.some((c) => c.id === savedConvId)) {
        selectConversation(savedConvId);
      } else if (res.data.length > 0) {
        selectConversation(res.data[0].id);
      } else {
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
    setIsLoadingHistory(false);
  };

  const selectConversation = async (convId: string) => {
    setActiveConversationId(convId);
    localStorage.setItem(LOCAL_STORAGE_CONV_KEY, convId);
    setIsLoadingHistory(true);

    const res = await mentorApi.getConversation(convId);
    if (res.success && res.data && res.data.messages) {
      setMessages(res.data.messages.length > 0 ? res.data.messages : [getWelcomeMessage()]);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
    setIsLoadingHistory(false);
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    localStorage.removeItem(LOCAL_STORAGE_CONV_KEY);
    setMessages([getWelcomeMessage()]);
    setErrorMessage(null);
    setInputText("");
    if (inputRef.current) inputRef.current.focus();
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setErrorMessage(null);
    setLastFailedText(null);
    if (!textToSend) setInputText("");

    // Optimistic User Message
    const tempUserMsg: MentorMessageDTO = {
      id: `usr-${Date.now()}`,
      conversationId: activeConversationId || "",
      role: "USER",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev.filter((m) => m.id !== "welcome-nexus-0"), tempUserMsg]);
    setIsTyping(true);

    // Call Real Gemini Backend microservice
    const res = await mentorApi.sendMessage(activeConversationId || undefined, text);

    if (res.success && res.data) {
      const { conversationId, title, userMessage, assistantMessage } = res.data;

      setActiveConversationId(conversationId);
      localStorage.setItem(LOCAL_STORAGE_CONV_KEY, conversationId);

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMsg.id && m.id !== "welcome-nexus-0"),
        userMessage,
        assistantMessage,
      ]);

      // Update local conversations list
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversationId);
        if (exists) {
          return prev.map((c) => (c.id === conversationId ? { ...c, title, updatedAt: new Date().toISOString() } : c));
        }
        return [
          {
            id: conversationId,
            userId: user?.id || "",
            title,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ];
      });
    } else {
      setErrorMessage(res.error || "Nexus AI was unable to generate a response.");
      setLastFailedText(text);
    }

    setIsTyping(false);
  };

  const handleRetry = () => {
    if (lastFailedText) {
      handleSendMessage(lastFailedText);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Floating Chat Panel */}
      {isOpen && (
        <div className="mb-4 w-88 sm:w-[440px] rounded-3xl bg-slate-950/95 border border-slate-800/90 text-white shadow-2xl backdrop-blur-2xl overflow-hidden animate-fadeIn flex flex-col h-[540px]">
          
          {/* Header */}
          <div className="px-4 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Nexus AI</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                    Copilot
                  </span>
                </h4>
                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online 24/7 • Gemini 2.5
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleNewChat}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                title="Start new conversation"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="px-3 py-2 bg-red-500/10 border-b border-red-500/30 text-red-400 text-[11px] flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 truncate">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{errorMessage}</span>
              </div>
              {lastFailedText && (
                <button
                  onClick={handleRetry}
                  className="px-2 py-0.5 rounded bg-red-500 text-white font-bold text-[9px] flex-shrink-0"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs scrollbar-thin">
            {isLoadingHistory ? (
              <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                <span>Loading conversation history...</span>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === "USER";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar Icon */}
                    {isUser ? (
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 font-bold text-[10px] mt-1">
                        {user?.firstName?.[0]?.toUpperCase() || "U"}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 mb-1 text-[9px] text-slate-400 font-medium">
                        <span>{isUser ? "You" : "Nexus AI"}</span>
                        {msg.createdAt && <span>• {formatTime(msg.createdAt)}</span>}
                      </div>

                      <div
                        className={`p-3.5 rounded-2xl leading-relaxed text-xs ${
                          isUser
                            ? "bg-gradient-to-r from-cyan-500 to-sky-600 text-white rounded-tr-none shadow-md font-medium"
                            : "bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none shadow-sm"
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        ) : (
                          <MarkdownRenderer content={msg.content} />
                        )}

                        {!isUser && msg.id !== "welcome-nexus-0" && (
                          <div className="flex items-center justify-end gap-1.5 pt-2 mt-2 border-t border-slate-800/60 text-[9px] text-slate-400">
                            <button
                              type="button"
                              onClick={() => handleCopy(msg.id, msg.content)}
                              className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
                            >
                              {copiedId === msg.id ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                              <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-white" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] text-slate-400 mb-1 font-medium">Nexus AI</span>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-medium text-slate-400">Nexus AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {PROMPT_SUGGESTIONS.map((p) => (
              <button
                key={p}
                disabled={isTyping}
                onClick={() => handleSendMessage(p)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-cyan-500/20 hover:border-cyan-500/40 text-[10px] font-semibold text-slate-300 hover:text-cyan-300 border border-slate-700/60 whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isTyping}
              placeholder="Ask Nexus anything about your career..."
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-medium"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:opacity-90 text-slate-950 disabled:opacity-40 transition-all shadow-md font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-extrabold text-xs shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all duration-300 active:scale-95"
      >
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <span>Nexus AI</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </button>
    </div>
  );
}
