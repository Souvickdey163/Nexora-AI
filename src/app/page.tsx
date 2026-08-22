import React from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Hero } from "@/components/hero/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeatureShowcase } from "@/components/sections/FeatureShowcase";
import { CareerIntelligence } from "@/components/sections/CareerIntelligence";
import { AnalyticsPreview } from "@/components/sections/AnalyticsPreview";
import { ResponsibleAI } from "@/components/sections/ResponsibleAI";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <FeatureShowcase />
        <CareerIntelligence />
        <AnalyticsPreview />
        <ResponsibleAI />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
