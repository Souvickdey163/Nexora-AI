"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  ArrowRight,
  User,
  LayoutDashboard,
  FileText,
  Video,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { FeaturesMegaMenu } from "./FeaturesMegaMenu";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";
import { NexoraLogo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { Avatar } from "@/components/common/Avatar";
import { CreditBalance } from "@/components/common/CreditBalance";
import { NotificationDrawer } from "@/components/common/NotificationDrawer";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, isLoggedIn, logout } = useAuth();

  const displayName = user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "User";
  const initials = ((user?.firstName?.[0] || "") + (user?.lastName?.[0] || "")).toUpperCase() || "U";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 py-3.5 shadow-sm"
          : "bg-transparent py-5 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NexoraLogo size="md" />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600 dark:text-slate-300">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-full hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              Home
            </Link>

            {/* Features Dropdown Menu Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setFeaturesOpen(!featuresOpen)}
                aria-expanded={featuresOpen}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors focus:outline-none"
              >
                <span>Features</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    featuresOpen ? "rotate-180 text-sky-500" : ""
                  }`}
                />
              </button>

              {/* Mega Dropdown */}
              {featuresOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                  <FeaturesMegaMenu onClose={() => setFeaturesOpen(false)} />
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="px-3.5 py-2 rounded-full hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              Premium
            </Link>

            <Link
              href="/about"
              className="px-3.5 py-2 rounded-full hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="px-3.5 py-2 rounded-full hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Right CTAs: Signed In Profile OR Sign In/Sign Up */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                {/* Dynamic Credit Balance Badge */}
                <CreditBalance compact />

                {/* In-app Notifications */}
                <NotificationDrawer />

                {/* User Profile Dropdown Pill after Signing In */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-all shadow-sm focus:outline-none"
                  >
                    <Avatar
                      src={user?.avatar || user?.avatarUrl}
                      name={displayName}
                      size="sm"
                    />
                    <span className="text-xs font-bold tracking-tight">{displayName}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                        profileOpen ? "rotate-180 text-sky-500" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown Menu */}
                  {profileOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-fadeIn"
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5 mb-1">
                          <Avatar
                            src={user?.avatar || user?.avatarUrl}
                            name={displayName}
                            size="sm"
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium truncate">{user?.email || ""}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">Balance</span>
                          <span className="text-xs font-extrabold text-sky-600 dark:text-sky-400">⚡ {user?.credits ?? 0} Credits</span>
                        </div>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4 text-sky-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        href="/"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/pricing"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Upgrade / Buy Credits</span>
                      </Link>

                      <button
                        onClick={async () => {
                          setProfileOpen(false);
                          await logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors pt-2 border-t border-slate-100 dark:border-slate-800"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Sign In / Sign Up CTA when Guest */
              <Link
                href="/auth"
                className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs tracking-wide hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <span>Sign In / Sign Up</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Open Mobile Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
