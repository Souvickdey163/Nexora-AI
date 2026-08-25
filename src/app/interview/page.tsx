import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { InterviewWorkspace } from "@/components/interview/InterviewWorkspace";

export const metadata: Metadata = {
  title: "AI Mock Interview & Role Simulator | Nexora AI",
  description:
    "Practice HR, technical, behavioral, and system design interviews with real-time AI voice simulation, live transcript evaluation, and 5-dimension scoring rubric.",
};

export default function InterviewPage() {
  return (
    <FeatureLayout
      featureId="mock-interview"
      title="AI Mock Interview"
      subtitle="Simulate real technical, behavioral, and system-design interviews with real-time AI voice feedback and transcript analysis."
      category="Interview Preparation"
      badge="Interactive"
    >
      <InterviewWorkspace />
    </FeatureLayout>
  );
}
