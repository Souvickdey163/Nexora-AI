"use client";

import React, { useState, useEffect, useRef } from "react";
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
  User,
  Plus,
  Trash2,
  AlertTriangle,
  ChevronRight,
  MessageSquare,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { mentorApi, MentorConversationDTO, MentorMessageDTO } from "@/lib/api/mentor";

export function CareerMentorWorkspace() {
  const { user } = useAuth();
  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Candidate";
  const initials = ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "C";
  const greetingName = user?.firstName || "Candidate";

  // State
  const [conversations, setConversations] = useState<MentorConversationDTO[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MentorMessageDTO[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingConversations, setIsFetchingConversations] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedPrompts = [
    "How can I optimize my resume for Tier-1 companies?",
    "What skills should I learn next for Staff Engineer?",
    "How should I prepare for System Design interviews?",
    "Create a 4-week study plan for DSA & System Design",
    "How do I highlight leadership in behavioral interviews?",
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Load User Conversations on mount
  useEffect(() => {
    if (user) {
      loadConversations();
    } else {
      setIsFetchingConversations(false);
    }
  }, [user]);

  const loadConversations = async () => {
    setIsFetchingConversations(true);
    setErrorMessage(null);

    const res = await mentorApi.listConversations();
    if (res.success && res.data) {
      setConversations(res.data);
      if (res.data.length > 0) {
        // Select most recent conversation by default
        selectConversation(res.data[0].id);
      } else {
        // Set welcome placeholder state for brand new user
        setMessages([getWelcomeMessage()]);
      }
    } else if (res.error) {
      setErrorMessage(res.error);
    }
    setIsFetchingConversations(false);
  };

  const getWelcomeMessage = (): MentorMessageDTO => ({
    id: "welcome-0",
    conversationId: "",
    role: "ASSISTANT",
    content: `Hello ${greetingName}! I'm **Nexus AI** ⚡ — your AI Career Copilot powered by Gemini 2.5 Flash. I'm here to provide personalized guidance on resume ATS optimization, career progression, DSA, system design, and placement preparation.\n\nHow can I help guide your engineering career today?`,
    createdAt: new Date().toISOString(),
  });

  const selectConversation = async (id: string) => {
    setActiveConversationId(id);
    setErrorMessage(null);
    setIsLoading(true);

    const res = await mentorApi.getConversation(id);
    if (res.success && res.data && res.data.messages) {
      setMessages(res.data.messages.length > 0 ? res.data.messages : [getWelcomeMessage()]);
    } else if (res.error) {
      setErrorMessage(res.error);
    }
    setIsLoading(false);
  };

  const handleNewChat = async () => {
    setActiveConversationId(null);
    setMessages([getWelcomeMessage()]);
    setErrorMessage(null);
    setInputPrompt("");
    if (textareaRef.current) textareaRef.current.focus();
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this conversation history?")) return;

    const res = await mentorApi.deleteConversation(id);
    if (res.success) {
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (activeConversationId === id) {
        if (updated.length > 0) {
          selectConversation(updated[0].id);
        } else {
          handleNewChat();
        }
      }
    } else if (res.error) {
      setErrorMessage(res.error);
    }
  };

  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = (overrideText || inputPrompt).trim();
    if (!textToSend || isLoading) return;

    setErrorMessage(null);
    setLastFailedMessage(null);
    if (!overrideText) setInputPrompt("");

    // Optimistic User Message
    const tempUserMessage: MentorMessageDTO = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId || "",
      role: "USER",
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev.filter((m) => m.id !== "welcome-0"), tempUserMessage]);
    setIsLoading(true);

    const res = await mentorApi.sendMessage(activeConversationId || undefined, textToSend);

    if (res.success && res.data) {
      const { conversationId, title, userMessage, assistantMessage } = res.data;

      setActiveConversationId(conversationId);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== tempUserMessage.id && m.id !== "welcome-0"),
        userMessage,
        assistantMessage,
      ]);

      // Update conversations list sidebar
      setConversations((prev) => {
        const exists = prev.some((c) => c.id === conversationId);
        if (exists) {
          return prev.map((c) => (c.id === conversationId ? { ...c, title, updatedAt: new Date().toISOString() } : c));
        } else {
          return [{ id: conversationId, userId: user?.id || "", title, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev];
        }
      });
    } else {
      setErrorMessage(res.error || "Failed to receive AI Mentor response.");
      setLastFailedMessage(textToSend);
    }

    setIsLoading(false);
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      handleSendMessage(lastFailedMessage);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTimestamp = (isoString?: string) => {
    if (!isoString) return "Just now";
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
      {/* LEFT COLUMN: Conversation Threads & History */}
      <div className="lg:col-span-3 space-y-4">
        <GlassCard className="space-y-4 flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
              Mentor Threads
            </span>
            <Badge variant="sky">Gemini Free</Badge>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-all shadow-md shadow-sky-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>New Conversation</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[480px] pr-1">
            {isFetchingConversations ? (
              <div className="text-center py-6 text-xs text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Loading threads...</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 px-2 text-xs text-slate-400">
                No past conversations. Start a new chat below!
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full group p-2.5 rounded-xl text-xs font-medium flex items-center justify-between cursor-pointer transition-colors ${
                      isActive
                        ? "bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 font-semibold"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <span className="truncate flex-1 pr-2">{conv.title || "Untitled Chat"}</span>
                    <button
                      onClick={(e) => handleDeleteConversation(e, conv.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-1"
                      title="Delete thread"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>

      {/* CENTER COLUMN: Interactive Chat Interface */}
      <div className="lg:col-span-6 flex flex-col space-y-4">
        <GlassCard className="flex-1 flex flex-col p-4 min-h-[520px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-500 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Nexus AI
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium">
                    gemini-2.5-flash
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500">24/7 Smart Career Copilot for Software Engineers</p>
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              {lastFailedMessage && (
                <button
                  onClick={handleRetry}
                  className="px-2 py-1 rounded bg-red-500 text-white font-semibold text-[10px] flex items-center gap-1 hover:bg-red-600 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </button>
              )}
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-3 max-h-[420px]">
            {messages.map((msg) => {
              const isUser = msg.role === "USER";
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-slate-400">
                      {isUser ? "You" : "Nexus AI"} • {formatTimestamp(msg.createdAt)}
                    </span>
                  </div>
                  <div
                    className={`p-4 rounded-2xl max-w-[88%] text-xs leading-relaxed ${
                      isUser
                        ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-br-none shadow-md"
                        : "bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/60"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>

                    {!isUser && (
                      <div className="flex items-center justify-end gap-2 pt-2.5 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-[10px] text-slate-500">
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="hover:text-sky-500 flex items-center gap-1 transition-colors"
                        >
                          {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedId === msg.id ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400">Nexus AI</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />
                  <span className="text-slate-500 font-medium">Generating response...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Suggested Career Prompts
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestedPrompts.slice(0, 3).map((prompt, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-500/10 hover:text-sky-500 text-[11px] font-medium text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Textarea Box */}
          <div className="flex items-end gap-2 pt-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                rows={2}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                maxLength={4000}
                disabled={isLoading}
                placeholder="Ask your career mentor anything... (Shift+Enter for newline)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"
              />
              <span className="absolute bottom-1.5 right-2 text-[9px] text-slate-400">
                {inputPrompt.length}/4000
              </span>
            </div>
            <GlowButton
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputPrompt.trim()}
              icon={Send}
              size="sm"
            >
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
              {initials}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{displayName}</h4>
              <p className="text-[11px] text-slate-500">{user?.role || "Software Engineer"}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Target Role:</span>
              <span className="font-bold text-sky-500">Full Stack Engineer</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">AI Microservice:</span>
              <span className="font-bold text-emerald-500">FastAPI Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">AI Provider:</span>
              <span className="font-bold text-slate-900 dark:text-white">Gemini Free Tier</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Career Readiness:</span>
              <span className="font-bold text-emerald-500">88%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-center">
            <ProgressRing progress={88} size={110} sublabel="Readiness" color="sky" />
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1 font-semibold text-slate-500">
              <Lock className="w-3 h-3 text-sky-500" />
              <span>Zero-Cost Server Protection</span>
            </div>
            <p className="leading-tight">
              Gemini API keys stay 100% server-side in FastAPI microservice. Rate limits apply per user.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
