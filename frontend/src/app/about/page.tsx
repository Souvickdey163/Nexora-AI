"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { aboutApi, PlatformOverviewData, UserCareerSummaryData } from "@/lib/api/about";

import { AboutHero } from "@/components/about/AboutHero";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutProblem } from "@/components/about/AboutProblem";
import { AboutSolution } from "@/components/about/AboutSolution";
import { AboutFeatures } from "@/components/about/AboutFeatures";
import { AboutHowItWorks } from "@/components/about/AboutHowItWorks";
import { AboutCareerIntelligence } from "@/components/about/AboutCareerIntelligence";
import { AboutUserJourney } from "@/components/about/AboutUserJourney";
import { AboutTechnology } from "@/components/about/AboutTechnology";
import { AboutSecurity } from "@/components/about/AboutSecurity";
import { AboutArchitecture } from "@/components/about/AboutArchitecture";
import { AboutEcosystem } from "@/components/about/AboutEcosystem";
import { AboutFutureVision } from "@/components/about/AboutFutureVision";
import { AboutFAQ } from "@/components/about/AboutFAQ";
import { AboutFinalCTA } from "@/components/about/AboutFinalCTA";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AboutPage() {
  const { isLoggedIn } = useAuth();

  const [platformData, setPlatformData] = useState<PlatformOverviewData | null>(null);
  const [userSummary, setUserSummary] = useState<UserCareerSummaryData | null>(null);
  const [loadingPlatform, setLoadingPlatform] = useState<boolean>(true);
  const [loadingSummary, setLoadingSummary] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoadingPlatform(true);
    setErrorMsg(null);

    try {
      const platformRes = await aboutApi.getPlatformInfo();
      if (platformRes.success && platformRes.data) {
        setPlatformData(platformRes.data);
      } else if (platformRes.error) {
        setErrorMsg(platformRes.error);
      }
    } catch (err: any) {
      setErrorMsg("Unable to load Nexora information right now.");
    } finally {
      setLoadingPlatform(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setLoadingSummary(true);
      aboutApi
        .getUserSummary()
        .then((res) => {
          if (res.success && res.data) {
            setUserSummary(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to load user summary for About page:", err);
        })
        .finally(() => {
          setLoadingSummary(false);
        });
    } else {
      setUserSummary(null);
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Network / Load Error Banner */}
        {errorMsg && (
          <div className="bg-rose-950/80 border-b border-rose-800/80 p-4 text-center text-xs text-rose-200 flex items-center justify-center gap-3">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Unable to load Nexora information right now.</span>
            <button
              onClick={loadData}
              className="px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* 1. Hero Section */}
        <AboutHero />

        {/* 2. Mission Section */}
        <AboutMission />

        {/* 3. The Problem */}
        <AboutProblem />

        {/* 4. The Nexora Solution */}
        <AboutSolution />

        {/* 5. Nexora Features */}
        <AboutFeatures />

        {/* 6. How Nexora Works */}
        <AboutHowItWorks />

        {/* 7. AI Career Intelligence */}
        <AboutCareerIntelligence userSummary={userSummary} isLoggedIn={isLoggedIn} />

        {/* 8. Personalized Career Journey */}
        <AboutUserJourney
          userSummary={userSummary}
          loadingSummary={loadingSummary}
          isLoggedIn={isLoggedIn}
        />

        {/* 9. Technology Section */}
        <AboutTechnology />

        {/* 10. Security & Privacy */}
        <AboutSecurity />

        {/* 11. Platform Architecture */}
        <AboutArchitecture />

        {/* 12. Product Ecosystem */}
        <AboutEcosystem />

        {/* 13. Future Vision */}
        <AboutFutureVision />

        {/* 14. FAQ Section */}
        <AboutFAQ />

        {/* 15. Final CTA */}
        <AboutFinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
