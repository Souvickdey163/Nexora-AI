import { Metadata } from "next";
import { AuthPageClient } from "@/components/auth/AuthPageClient";

export const metadata: Metadata = {
  title: "Candidate Sign In & Verification | Nexora AI",
  description:
    "Access your Nexora AI candidate portal, track ATS resume scores, practice mock interviews, and access personalized career roadmaps.",
};

export default function AuthPage() {
  return <AuthPageClient />;
}
