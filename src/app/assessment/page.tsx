import { Metadata } from "next";
import { FeatureLayout } from "@/components/layout/FeatureLayout";
import { SkillAssessmentWorkspace } from "@/components/assessment/SkillAssessmentWorkspace";

export const metadata: Metadata = {
  title: "Computer Science Skill Assessment & Diagnostic | Nexora AI",
  description:
    "Evaluate your computer science fundamentals in DSA, DBMS, OS, Computer Networks, and System Design with timed diagnostic tests.",
};

export default function AssessmentPage() {
  return (
    <FeatureLayout
      featureId="skill-assessment"
      title="Skill Assessment"
      subtitle="Evaluate DSA, Core CS (DBMS, OS, Computer Networks), System Design, and Soft Skills under timed diagnostic conditions."
      category="Evaluation Engine"
    >
      <SkillAssessmentWorkspace />
    </FeatureLayout>
  );
}
