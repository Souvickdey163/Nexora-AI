import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { CareerMentorWorkspace } from "@/components/mentor/CareerMentorWorkspace";

export const metadata: Metadata = {
  title: "AI Career Mentor & Advisor | Nexora AI",
  description:
    "Get 24/7 personalized career guidance, interview preparation advice, skill roadmap planning, and salary negotiation insights tailored to your target engineering roles.",
};

export default function MentorPage() {
  return (
    <FeatureLayout
      featureId="career-mentor"
      title="AI Career Mentor"
      subtitle="Get 24/7 personalized career guidance, learning recommendations, and strategic advice tailored to your target engineering goals."
      category="Guidance & Coaching"
    >
      <CareerMentorWorkspace />
    </FeatureLayout>
  );
}
