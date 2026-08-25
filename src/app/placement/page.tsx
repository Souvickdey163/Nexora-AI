import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { PlacementIntelligenceWorkspace } from "@/components/placement/PlacementIntelligenceWorkspace";

export const metadata: Metadata = {
  title: "Placement Intelligence & Company Matching | Nexora AI",
  description:
    "Estimate target company compatibility, skill-gap analysis, and tier-1 recruitment readiness insights based on your current developer profile.",
};

export default function PlacementPage() {
  return (
    <FeatureLayout
      featureId="placement-intelligence"
      title="Placement Intelligence"
      subtitle="Estimate company compatibility, skill gaps, and placement readiness timelines for tier-1 tech companies and startups."
      category="Company Matching"
    >
      <PlacementIntelligenceWorkspace />
    </FeatureLayout>
  );
}
