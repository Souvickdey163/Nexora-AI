"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { Badge } from "@/components/ui/Badge";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  TrendingUp,
  BookOpen,
  Building,
  Target,
  ArrowRight,
  Loader2,
  Filter,
  DollarSign,
} from "lucide-react";
import { jobsApi, JobOpportunity } from "@/lib/api/jobs";

export function JobOpportunitiesWorkspace() {
  const [recommendedJobs, setRecommendedJobs] = useState<JobOpportunity[]>([]);
  const [allJobs, setAllJobs] = useState<JobOpportunity[]>([]);
  const [topMissingSkills, setTopMissingSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedRemote, setSelectedRemote] = useState("All");
  const [selectedEmpType, setSelectedEmpType] = useState("All");

  const recommendedSectionRef = useRef<HTMLDivElement>(null);
  const allJobsSectionRef = useRef<HTMLDivElement>(null);

  const fetchJobsData = async () => {
    setLoading(true);
    const res = await jobsApi.getRecommendedJobs({
      q: searchQuery,
      location: locationFilter,
    });

    if (res.success) {
      setRecommendedJobs(res.recommendedJobs || []);
      setAllJobs(res.allJobs || []);
      setTopMissingSkills(res.topMissingSkills || []);
      setTargetRole(res.targetRole || null);
      setUserSkills(res.userSkills || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchJobsData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobsData();
  };

  const scrollToRecommended = () => {
    recommendedSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAllJobs = () => {
    allJobsSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter all jobs client-side based on user selection
  const filteredAllJobs = allJobs.filter((job) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      (job.location && job.location.toLowerCase().includes(q)) ||
      job.skills.some((s) => s.toLowerCase().includes(q));

    const matchesLocation =
      !locationFilter ||
      (job.location && job.location.toLowerCase().includes(locationFilter.toLowerCase()));

    const matchesRemote =
      selectedRemote === "All" ||
      (job.remoteType && job.remoteType.toLowerCase() === selectedRemote.toLowerCase());

    const matchesEmp =
      selectedEmpType === "All" ||
      (job.employmentType && job.employmentType.toLowerCase() === selectedEmpType.toLowerCase());

    return matchesQuery && matchesLocation && matchesRemote && matchesEmp;
  });

  // Calculate summary metrics
  const highMatchCount = recommendedJobs.filter((j) => (j.matchScore || 0) >= 80).length;
  const recentJobsCount = allJobs.length;

  const getMatchScoreBadgeVariant = (score: number) => {
    if (score >= 85) return "emerald";
    if (score >= 70) return "amber";
    return "sky";
  };

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <GlassCard className="relative overflow-hidden space-y-6 border-sky-500/20 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sky" size="sm" icon={Briefcase}>
                Job Opportunities
              </Badge>
              {targetRole && (
                <Badge variant="purple" size="sm" icon={Target}>
                  Target Role: {targetRole}
                </Badge>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Find Jobs That Match Your Career
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Discover relevant job openings based on your resume, skills, target role, experience, and preferred location. Powered by Nexora AI transparent match scoring.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <GlowButton size="md" icon={Sparkles} onClick={scrollToRecommended}>
                Find My Jobs
              </GlowButton>
              <GlowButton size="md" variant="outline" icon={Search} onClick={scrollToAllJobs}>
                Browse All Jobs
              </GlowButton>
            </div>
          </div>

          {/* Quick Resume Skills Radar summary card */}
          {userSkills.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5 min-w-[240px]">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Resume Profile
              </div>
              <div className="text-xs text-slate-400 font-semibold">
                Extracted Skills ({userSkills.length}):
              </div>
              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                {userSkills.slice(0, 8).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
                {userSkills.length > 8 && (
                  <span className="text-[10px] font-semibold text-slate-500 self-center">
                    +{userSkills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </GlassCard>

      {/* SUMMARY CARDS SECTION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            Recommended Jobs
            <Sparkles className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white">{recommendedJobs.length}</div>
          <p className="text-[11px] text-slate-500">Matched to your profile & target role</p>
        </GlassCard>

        <GlassCard className="space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            High Match Jobs
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{highMatchCount}</div>
          <p className="text-[11px] text-slate-500">80%+ Match score compatibility</p>
        </GlassCard>

        <GlassCard className="space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            Live Openings
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400">{recentJobsCount}</div>
          <p className="text-[11px] text-slate-500">Active postings from job providers</p>
        </GlassCard>

        <GlassCard className="space-y-1.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
            Skill Gaps Identified
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{topMissingSkills.length}</div>
          <p className="text-[11px] text-slate-500">High-demand skills to learn</p>
        </GlassCard>
      </div>

      {/* MAIN SECTION: RECOMMENDED FOR YOU */}
      <div ref={recommendedSectionRef} className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-500" />
              Recommended For You
            </h3>
            <p className="text-xs text-slate-500">
              Personalized matches calculated by comparing your resume skills and target role against live openings.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mx-auto mb-2" />
            <p className="text-xs font-medium text-slate-400">Finding jobs that match your career...</p>
          </div>
        ) : recommendedJobs.length === 0 ? (
          <GlassCard className="text-center py-12 space-y-2">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <p className="text-sm font-bold text-slate-300">No recommended jobs found.</p>
            <p className="text-xs text-slate-500">Upload a resume or update your target role to unlock personalized job matching.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendedJobs.map((job) => (
              <GlassCard
                key={`rec-job-${job.id}`}
                className="space-y-4 flex flex-col justify-between border-2 border-sky-500/20 hover:border-sky-500/50 transition-all shadow-lg shadow-sky-500/5"
              >
                <div className="space-y-3">
                  {/* Top Row: Title, Company & Match Score Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                        {job.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                        {job.company}
                      </p>
                    </div>

                    <Badge
                      variant={getMatchScoreBadgeVariant(job.matchScore || 70)}
                      size="md"
                      className="shrink-0 text-xs font-black shadow-sm"
                    >
                      <Zap className="w-3 h-3 mr-1 fill-current" />
                      {job.matchScore || 75}% Match
                    </Badge>
                  </div>

                  {/* Metadata Tags: Location, Remote, Employment Type */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      {job.location || "Remote"}
                    </span>
                    <span>•</span>
                    <Badge variant="purple" size="sm">
                      {job.employmentType || "Full-time"}
                    </Badge>
                    {job.remoteType && (
                      <Badge variant="sky" size="sm">
                        {job.remoteType}
                      </Badge>
                    )}
                  </div>

                  {/* Description snippet */}
                  {job.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                  )}

                  {/* SKILL MATCH & SKILL GAP BREAKDOWN */}
                  <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    {/* Matched Skills */}
                    {job.matchedSkills && job.matchedSkills.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Skill Match:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {job.matchedSkills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skill Gaps */}
                    {job.missingSkills && job.missingSkills.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> Skill Gap:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {job.missingSkills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20"
                            >
                              ⚠ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Via {job.source}
                  </span>

                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    <GlowButton size="sm" icon={ExternalLink}>
                      View Job / Apply
                    </GlowButton>
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* SECONDARY SECTION: ALL JOB OPPORTUNITIES */}
      <div ref={allJobsSectionRef} className="space-y-4 pt-4 border-t border-slate-800">
        <GlassCard className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                All Job Opportunities ({filteredAllJobs.length})
              </h3>
              <p className="text-xs text-slate-500">
                Browse live job postings from Jobvetta and industry data sources.
              </p>
            </div>

            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter title, skills..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="relative w-40 hidden sm:block">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  placeholder="Location..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <GlowButton size="sm" type="submit" icon={Search}>
                Search
              </GlowButton>
            </form>
          </div>

          {/* Filter Pills: Remote & Employment Type */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Work Mode:
              </span>
              {["All", "Remote", "Hybrid", "On-site"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedRemote(mode)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    selectedRemote === mode
                      ? "bg-sky-500 text-white shadow-md"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 border-l border-slate-700/50 pl-4">
              <span className="font-bold text-slate-400">Job Type:</span>
              {["All", "Full-time", "Part-time", "Contract"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedEmpType(type)}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] font-semibold transition-colors ${
                    selectedEmpType === type
                      ? "bg-indigo-500 text-white"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* All Jobs Grid */}
        {filteredAllJobs.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate-400 text-xs">
            No job opportunities found matching your filters.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAllJobs.map((job) => (
              <GlassCard key={job.id} className="space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                        {job.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-indigo-400" />
                        {job.company}
                      </p>
                    </div>

                    {job.matchScore && (
                      <Badge variant={getMatchScoreBadgeVariant(job.matchScore)} size="sm">
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-sky-500" />
                      {job.location || "Remote"}
                    </span>
                    <span>•</span>
                    <Badge variant="purple" size="sm">
                      {job.employmentType || "Full-time"}
                    </Badge>
                  </div>

                  {job.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Posted on {job.source}
                  </span>

                  <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                    <GlowButton size="sm" variant="outline" icon={ExternalLink}>
                      View Job
                    </GlowButton>
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* SKILL GAP SECTION — CONNECTS TO LEARNING HUB */}
      {topMissingSkills.length > 0 && (
        <GlassCard className="space-y-4 border-2 border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-slate-900 to-indigo-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                  Skills You Need for Your Target Jobs
                  <Badge variant="amber" size="sm">
                    Learning Gap Bridge
                  </Badge>
                </h3>
                <p className="text-xs text-slate-400">
                  Master these key required skills to boost your job match score for target engineering roles.
                </p>
              </div>
            </div>

            <Link href="/learning">
              <GlowButton size="sm" variant="secondary" icon={ArrowRight}>
                Open Learning Hub
              </GlowButton>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topMissingSkills.map((skill) => (
              <div
                key={skill}
                className="p-3 rounded-xl bg-slate-800/80 border border-amber-500/20 flex flex-col justify-between space-y-2 hover:border-amber-500/40 transition-colors"
              >
                <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  {skill}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">High demand in target roles</p>

                <Link href={`/learning?search=${encodeURIComponent(skill)}`}>
                  <button className="w-full text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center justify-center gap-1 pt-1 transition-colors">
                    Learn Skill <ArrowRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
