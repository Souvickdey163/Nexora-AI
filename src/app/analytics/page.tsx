import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { CareerAnalyticsWorkspace } from "@/components/analytics/CareerAnalyticsWorkspace";

export const metadata: Metadata = {
  title: "Career Analytics & Performance Tracking | Nexora AI",
  description:
    "Track your unified career readiness index, coding velocity, mock interview scoring curves, and skill proficiency heatmaps.",
};

export default function AnalyticsPage() {
  return (
    <FeatureLayout
      featureId="career-analytics"
      title="Career Analytics"
      subtitle="Track your coding velocity, interview progress, resume health, and overall career readiness in one unified dashboard."
      category="Performance Tracking"
    >
      <CareerAnalyticsWorkspace />
    </FeatureLayout>
  );
}
