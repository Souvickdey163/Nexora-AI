import { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ResumePageClient } from "@/components/resume/ResumePageClient";

export const metadata: Metadata = {
  title: "AI Resume Intelligence & ATS Scoring | Nexora AI",
  description:
    "Upload your resume to calculate real-time ATS compatibility scores, detect missing skill keywords, rewrite bullet points with action metrics, and match against target job descriptions.",
};

export default function ResumePage() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <ResumePageClient />
      </main>
      <Footer />
    </div>
  );
}
