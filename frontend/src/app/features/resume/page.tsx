import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { ResumePageClient } from "@/components/resume/ResumePageClient";

export const metadata: Metadata = {
  title: "AI Resume Intelligence & ATS Scoring | Nexora AI",
  description:
    "Upload your resume to calculate real-time ATS compatibility scores, detect missing skill keywords, rewrite bullet points with action metrics, and match against target job descriptions.",
};

export default function FeaturesResumePage() {
  return (
    <FeatureLayout
      featureId="resume-intelligence"
      title="AI Resume Intelligence"
      subtitle="Turn Your Resume Into a Career Advantage with real-time ATS scoring, keyword extraction, and AI bullet rewriter."
      category="Resume & ATS Optimization"
      badge="Popular"
      hideHeaderNav={true}
    >
      <ResumePageClient />
    </FeatureLayout>
  );
}
