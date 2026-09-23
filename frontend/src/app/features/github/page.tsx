import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { GitHubWorkspace } from "@/components/github/GitHubWorkspace";

export const metadata: Metadata = {
  title: "GitHub Intelligence & Repository Analytics | Nexora AI",
  description:
    "Analyze real-world GitHub code repositories, technical skills evidence, engineering practice signals, ATS resume alignment, and project-specific interview questions.",
};

export default function FeaturesGitHubPage() {
  return (
    <FeatureLayout
      featureId="github-intelligence"
      title="GitHub Intelligence"
      subtitle="Analyze your real-world development projects, technical skills evidence, engineering practice signals, and code quality."
      category="Developer Intelligence"
      badge="Real GitHub API"
    >
      <GitHubWorkspace />
    </FeatureLayout>
  );
}
