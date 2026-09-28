import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { JobOpportunitiesWorkspace } from "@/components/jobs/JobOpportunitiesWorkspace";

export const metadata: Metadata = {
  title: "Job Opportunities & Career Matching | Nexora AI",
  description:
    "Discover relevant job openings based on your resume, skills, target role, experience, and preferred location.",
};

export default function AnalyticsPage() {
  return (
    <FeatureLayout
      featureId="job-opportunities"
      title="Job Opportunities"
      subtitle="Discover relevant job openings based on your resume, skills, target role, experience, and preferred location."
      category="Career Matching"
    >
      <JobOpportunitiesWorkspace />
    </FeatureLayout>
  );
}
