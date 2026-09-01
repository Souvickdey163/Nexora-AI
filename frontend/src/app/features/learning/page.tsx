import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { LearningHubWorkspace } from "@/components/learning/LearningHubWorkspace";

export const metadata: Metadata = {
  title: "Learning Hub & Interview Resources | Nexora AI",
  description:
    "Handpicked computer science learning resources, system design cheat sheets, DSA patterns, and behavioral interview guides.",
};

export default function FeaturesLearningPage() {
  return (
    <FeatureLayout
      featureId="learning-hub"
      title="Learning Hub"
      subtitle="Access handpicked DSA pattern guides, system design cheat sheets, and behavioral interview workbooks."
      category="Resource Library"
    >
      <LearningHubWorkspace />
    </FeatureLayout>
  );
}
