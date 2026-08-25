"use client";

import React from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardHeroCard } from "./DashboardHeroCard";
import { DashboardFeatureHub } from "./DashboardFeatureHub";
import { FloatingAiAssistant } from "./FloatingAiAssistant";

export function DashboardClient() {
  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar />

      {/* 2. Right Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top App Header */}
        <DashboardHeader />

        {/* Scrollable Dashboard Body Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8 scrollbar-thin">
          <div className="max-w-[1400px] mx-auto space-y-8">
            
            {/* Hero Action Plan Section */}
            <DashboardHeroCard />

            {/* AI Feature Engines Suite Hub */}
            <DashboardFeatureHub />

          </div>
        </main>
      </div>

      {/* 3. Floating Bottom-Right AI Assistant Widget */}
      <FloatingAiAssistant />

    </div>
  );
}
