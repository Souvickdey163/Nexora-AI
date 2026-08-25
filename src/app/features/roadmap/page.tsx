import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { PersonalizedRoadmapWorkspace } from "@/components/roadmap/PersonalizedRoadmapWorkspace";

export const metadata: Metadata = {
  title: "Personalized Career Roadmap & Pathway | Nexora AI",
  description:
    "Interactive step-by-step career path tailored to your target software engineering role, skill gaps, and learning pace.",
};

export default function FeaturesRoadmapPage() {
  return (
    <FeatureLayout
      featureId="career-roadmap"
      title="Personalized Roadmap"
      subtitle="Generate dynamic, milestone-based career roadmaps adapted to your target job role and weekly study schedule."
      category="Structured Growth"
    >
      <PersonalizedRoadmapWorkspace />
    </FeatureLayout>
  );
}
