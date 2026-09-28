"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  UserCheck,
  FileText,
  Code2,
  Video,
  GitBranch,
  Target,
  ArrowRight,
  LogIn,
  Coins,
  Sparkles,
  CheckCircle,
  Clock,
} from "lucide-react";
import { UserCareerSummaryData } from "@/lib/api/about";

interface AboutUserJourneyProps {
  userSummary: UserCareerSummaryData | null;
  loadingSummary: boolean;
  isLoggedIn: boolean;
}

export const AboutUserJourney: React.FC<AboutUserJourneyProps> = ({
  userSummary,
  loadingSummary,
  isLoggedIn,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>PERSONAL TELEMETRY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Your Journey With <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Nexora</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Real-time synchronization of your activity, milestones, and preparation stats directly from your Nexora account.
          </p>
        </div>

        {/* Dynamic State Rendering */}
        {!isLoggedIn ? (
          /* LOGGED OUT STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto p-8 sm:p-10 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <LogIn className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-bold text-white">
              Sign in to see your personalized career journey
            </h3>

            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Track your resume ATS uploads, solved coding challenges, mock interview scores, and career readiness stats in one unified dashboard.
            </p>

            <div className="pt-2">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all duration-300"
              >
                <span>Sign In or Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        ) : loadingSummary ? (
          /* LOADING STATE */
          <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-1/3 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-24 bg-slate-900 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : userSummary ? (
          /* AUTHENTICATED USER STATS STATE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* User Profile Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-md">
                  {userSummary.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{userSummary.user.name}</h3>
                  <p className="text-xs text-slate-400">{userSummary.user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                      userSummary.user.profileCompleted
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}>
                      {userSummary.user.profileCompleted ? "Target Role Configured" : "Profile Setup Needed"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <Coins className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <p className="text-[11px] text-slate-400">Available AI Credits</p>
                  <p className="text-lg font-extrabold text-white">{userSummary.user.credits} Credits</p>
                </div>
              </div>
            </div>

            {/* Check if user has zero activity */}
            {Object.values(userSummary.careerStats).every(
              (val) => val === 0 || val === false
            ) ? (
              <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-cyan-400 mx-auto" />
                <h4 className="text-xl font-bold text-white">Your career journey starts here.</h4>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  You haven&apos;t completed any activities yet. Start by completing your profile and uploading your resume.
                </p>
                <div className="pt-2">
                  <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition"
                  >
                    <span>Start Building Your Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              /* REAL ACTIVITY STATS GRID */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                    <FileText className="w-4 h-4" />
                    <span>Resumes Uploaded</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {userSummary.careerStats.resumesUploaded}
                  </p>
                  <p className="text-[11px] text-slate-500">ATS processed documents</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <Code2 className="w-4 h-4" />
                    <span>Coding Solved</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {userSummary.careerStats.codingProblemsSolved}
                  </p>
                  <p className="text-[11px] text-slate-500">Algorithmic challenges</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold">
                    <Video className="w-4 h-4" />
                    <span>Mock Tests Completed</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {userSummary.careerStats.mockTestsCompleted}
                  </p>
                  <p className="text-[11px] text-slate-500">MCQs & AI interviews</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold">
                    <GitBranch className="w-4 h-4" />
                    <span>GitHub Integration</span>
                  </div>
                  <p className="text-base font-bold text-white">
                    {userSummary.careerStats.githubConnected ? "Connected" : "Not Linked"}
                  </p>
                  <p className="text-[11px] text-slate-500">Repository analytics</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                    <Target className="w-4 h-4" />
                    <span>Active Roadmaps</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {userSummary.careerStats.roadmapsCreated}
                  </p>
                  <p className="text-[11px] text-slate-500">Targeted skill paths</p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4" />
                    <span>Readiness Reports</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {userSummary.careerStats.placementAssessmentsCompleted}
                  </p>
                  <p className="text-[11px] text-slate-500">Placement evaluations</p>
                </div>
              </div>
            )}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
};
