import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { GithubIntelligenceWorkspace } from "@/components/github/GithubIntelligenceWorkspace";

export const metadata: Metadata = {
  title: "GitHub Repository Intelligence & Architecture Analyzer | Nexora AI",
  description:
    "Evaluate public GitHub repository architecture quality, code cleanliness, README impact score, commit consistency, and security findings.",
};

export default function FeaturesGithubPage() {
  return (
    <FeatureLayout
      featureId="github-intelligence"
      title="GitHub Intelligence"
      subtitle="Evaluate GitHub repository architecture, code quality, test coverage, and recruiter portfolio visibility."
      category="Project Portfolio"
      badge="New"
    >
      <GithubIntelligenceWorkspace />
    </FeatureLayout>
  );
}
