import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { FloatingAiAssistant } from "@/components/dashboard/FloatingAiAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexora AI — Your AI Career Copilot",
  description:
    "One intelligent platform for resumes, mock interviews, coding arena, GitHub portfolio analysis, career roadmaps, and placement preparation.",
  icons: {
    icon: "/logo-transparent.png",
    apple: "/logo-transparent.png",
  },
  keywords: [
    "Nexora AI",
    "AI Career Copilot",
    "Resume Intelligence",
    "Mock Interview AI",
    "Coding Arena",
    "GitHub Analysis",
    "Placement Preparation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ThemeProvider>
          <AuthProvider>
            {children}
            <FloatingAiAssistant />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
