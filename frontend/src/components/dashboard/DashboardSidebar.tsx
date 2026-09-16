"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  Video,
  Code2,
  FolderGit2,
  BarChart3,
  Map,
  Bot,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  MessageSquarePlus,
  Settings,
  Puzzle,
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: Home },
  { name: "AI Resume Intelligence", href: "/resume", icon: FileText, badge: "ATS AI" },
  { name: "AI Mock Interviews", href: "/interview", icon: Video, badge: "Voice AI" },
  { name: "Coding Arena & DSA", href: "/coding", icon: Code2 },
  { name: "GitHub Intelligence", href: "/github", icon: FolderGit2 },
  { name: "Career Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Placement Roadmap", href: "/roadmap", icon: Map },
  { name: "AI Mentorship Agent", href: "/mentor", icon: Bot, badge: "24/7" },
  { name: "Job Opportunities", href: "/placement", icon: Briefcase },
];

const BOTTOM_NAV = [
  { name: "Chrome Extension", href: "#", icon: Puzzle },
  { name: "Suggest Feature", href: "#", icon: MessageSquarePlus },
  { name: "Support & FAQ", href: "#", icon: HelpCircle },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-900 text-slate-200 border-r border-slate-800 transition-all duration-300 z-30 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 shrink-0">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700/80 p-1 flex items-center justify-center shrink-0 shadow-sm">
            <Image
              src="/logo-nexora.png"
              alt="Nexora AI Logo"
              width={28}
              height={28}
              className="w-full h-full object-contain"
            />
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-lg text-white tracking-tight">Nexora</span>
              <span className="text-sky-400 font-extrabold text-lg">.ai</span>
            </div>
          )}
        </Link>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 scrollbar-thin">
        {!isCollapsed && (
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Intelligence Engines
          </div>
        )}

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-white border border-sky-500/30 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-sky-400" : "text-slate-400 group-hover:text-sky-400"}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </div>

              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-[10px] font-bold shrink-0">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom Nav Links */}
      <div className="p-3 border-t border-slate-800 space-y-1 shrink-0">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="w-4 h-4 text-slate-500" />
              {!isCollapsed && <span>{item.name}</span>}
            </a>
          );
        })}
      </div>

    </aside>
  );
}
