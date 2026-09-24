"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Briefcase,
  GraduationCap,
  MapPin,
  Globe,
  History,
  Shield,
  Key,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { Avatar } from "@/components/common/Avatar";
import { useAuth } from "@/context/AuthContext";
import { profileApi, UserProfileData } from "@/lib/api/profile";
import { creditsApi } from "@/lib/api/credits";

export default function ProfilePage() {
  const { user, isLoggedIn, updateUser, updateCredits } = useAuth();

  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Form Fields State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [education, setEducation] = useState("");
  const [location, setLocation] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  useEffect(() => {
    async function loadData() {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const [profRes, credRes] = await Promise.all([
          profileApi.getProfile(),
          creditsApi.getHistory(),
        ]);

        if (profRes.success && profRes.data?.user) {
          const u = profRes.data.user;
          setProfileData(u);
          setFirstName(u.firstName || "");
          setLastName(u.lastName || "");
          setHeadline(u.profile?.headline || "");
          setBio(u.profile?.bio || "");
          setTargetRole(u.profile?.targetRole || "");
          setEducation(u.profile?.education || "");
          setLocation(u.profile?.location || "");
          setWebsiteUrl(u.profile?.websiteUrl || "");
          setGithubUrl(u.profile?.githubUrl || "");
          setLinkedinUrl(u.profile?.linkedinUrl || "");
          if (u.credits !== undefined) updateCredits(u.credits);
        }

        if (credRes.success && credRes.data?.transactions) {
          setTransactions(credRes.data.transactions);
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [isLoggedIn, updateCredits]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const res = await profileApi.updateProfile({
        firstName,
        lastName,
        headline,
        bio,
        targetRole,
        education,
        location,
        websiteUrl,
        githubUrl,
        linkedinUrl,
      });

      if (res.success && res.data?.user) {
        setSaveSuccess("Saved successfully! Profile updated.");
        updateUser({
          firstName,
          lastName,
          name: `${firstName} ${lastName}`.trim(),
        });
      } else {
        throw new Error(res.error || "Failed to update profile.");
      }
    } catch (err: any) {
      setSaveError(err.message || "An error occurred while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setSaveError("Invalid image type. Please select a JPG, PNG, or WEBP file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveError("File is too large. Maximum photo size is 5 MB.");
      return;
    }

    setUploadingAvatar(true);
    setSaveSuccess(null);
    setSaveError(null);

    try {
      const res = await profileApi.uploadAvatar(file);
      if (res.success && res.data?.avatarUrl) {
        setSaveSuccess("Profile photo updated successfully!");
        setProfileData((prev) => (prev ? { ...prev, avatarUrl: res.data.avatarUrl } : null));
        updateUser({ avatar: res.data.avatarUrl, avatarUrl: res.data.avatarUrl });
      } else {
        throw new Error(res.error || "Failed to upload avatar.");
      }
    } catch (err: any) {
      setSaveError(err.message || "Avatar upload failed.");
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading user profile...</p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
        <Navbar />
        <main className="max-w-md mx-auto my-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
          <Shield className="w-12 h-12 text-sky-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Authentication Required</h2>
          <p className="text-xs text-slate-500">Please sign in to view and manage your profile.</p>
          <Link
            href="/auth"
            className="inline-block px-6 py-2.5 rounded-full bg-sky-500 text-white font-bold text-xs"
          >
            Sign In / Register
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const displayName = `${firstName} ${lastName}`.trim() || user?.name || "User";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-10">
        {/* PROFILE HEADER CARD */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-center gap-6 text-center sm:text-left">
            {/* AVATAR WITH PHOTO UPLOAD */}
            <div className="relative group shrink-0">
              <Avatar
                src={profileData?.avatarUrl || user?.avatar || user?.avatarUrl}
                name={displayName}
                size="xl"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg cursor-pointer hover:scale-110 transition-transform"
                title="Upload Profile Photo"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarUpload}
                disabled={uploadingAvatar}
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">{displayName}</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user?.email}</p>
              {headline && (
                <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 pt-1">{headline}</p>
              )}
            </div>
          </div>

          {/* CREDITS SUMMARY CARD */}
          <div className="p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 text-center sm:text-right shrink-0 space-y-2 min-w-[200px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Nexora Balance</span>
            <div className="text-xl font-black text-sky-600 dark:text-sky-400 flex items-center justify-center sm:justify-end gap-1">
              <Zap className="w-5 h-5 fill-current" />
              <span>⚡ {user?.credits ?? profileData?.credits ?? 0}</span>
            </div>
            <Link
              href="/pricing"
              className="inline-block text-[11px] font-bold text-sky-600 hover:text-sky-500 dark:text-sky-400"
            >
              + Buy More Credits
            </Link>
          </div>
        </section>

        {/* FEEDBACK BANNERS */}
        {saveError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
        )}

        {/* EDIT PROFILE FORM & DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* MAIN FORM */}
          <section className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <UserIcon className="w-5 h-5 text-sky-500" />
              <span>Edit Personal & Professional Details</span>
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Headline / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Engineer @ Tech Company"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bio</label>
                <textarea
                  rows={3}
                  placeholder="Brief overview of your experience and career aspirations..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Role</label>
                  <input
                    type="text"
                    placeholder="Software Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Education</label>
                  <input
                    type="text"
                    placeholder="B.Tech Computer Science"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Website URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                    <span>GitHub URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-slate-400 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                    <span>LinkedIn URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-sky-500/20"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* SIDEBAR: CONNECTED ACCOUNTS & SECURITY */}
          <aside className="space-y-6">
            {/* CONNECTED ACCOUNTS */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Connected OAuth Accounts</span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <AccountBadge
                  name="Google"
                  connected={profileData?.connectedAccounts?.includes("GOOGLE")}
                />
                <AccountBadge
                  name="GitHub"
                  connected={profileData?.connectedAccounts?.includes("GITHUB")}
                />
                <AccountBadge
                  name="LinkedIn"
                  connected={profileData?.connectedAccounts?.includes("LINKEDIN")}
                />
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Key className="w-4 h-4 text-sky-500" />
                <span>Account Security</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Email verification status:{" "}
                <span className="font-bold text-emerald-500">
                  {user?.isEmailVerified || profileData?.emailVerified ? "Verified" : "Unverified"}
                </span>
              </p>
            </div>
          </aside>
        </div>

        {/* CREDIT TRANSACTION HISTORY TABLE */}
        <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-sky-500" />
              <span>Credit Transaction History</span>
            </h2>
            <Link
              href="/pricing"
              className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Get More Credits
            </Link>
          </div>

          {transactions.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No credit transactions recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Description</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {tx.type}
                      </td>
                      <td
                        className={`py-3 px-3 font-extrabold ${
                          tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {tx.description || tx.source}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function AccountBadge({ name, connected }: { name: string; connected?: boolean }) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
      <span className="font-bold text-slate-700 dark:text-slate-300">{name}</span>
      {connected ? (
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
          Connected
        </span>
      ) : (
        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-[10px]">
          Not Connected
        </span>
      )}
    </div>
  );
}
