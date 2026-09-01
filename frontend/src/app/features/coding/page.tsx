import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { CodingArenaWorkspace } from "@/components/coding/CodingArenaWorkspace";

export const metadata: Metadata = {
  title: "Coding Arena & DSA Practice | Nexora AI",
  description:
    "Solve curated Data Structures & Algorithms coding challenges in an integrated multi-language code editor with automated time & space complexity AI reviews.",
};

export default function FeaturesCodingPage() {
  return (
    <FeatureLayout
      featureId="coding-arena"
      title="Coding Arena"
      subtitle="Master Data Structures & Algorithms with multi-language code editing, instant test execution, and AI complexity reviews."
      category="Problem Solving"
    >
      <CodingArenaWorkspace />
    </FeatureLayout>
  );
}
