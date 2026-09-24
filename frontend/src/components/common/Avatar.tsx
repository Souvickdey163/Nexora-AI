"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-7 h-7 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-24 h-24 text-3xl",
};

export function Avatar({ src, name, size = "md", className = "" }: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback Initials
  const getInitials = (fullName?: string | null) => {
    if (!fullName || !fullName.trim()) return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  const initials = getInitials(name);

  // If backend returns a relative avatar path (e.g., /api/profile/avatar/...), prefix with backend URL if needed
  const getFullAvatarUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
      return url;
    }
    const backendHost = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/auth$/, "")
      : "http://localhost:5001";
    return `${backendHost}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const fullUrl = getFullAvatarUrl(src);

  if (fullUrl && !imageError) {
    return (
      <div
        className={`relative overflow-hidden rounded-full shrink-0 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 ${sizeClasses[size]} ${className}`}
      >
        <img
          src={fullUrl}
          alt={name || "User Avatar"}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`rounded-full shrink-0 bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center shadow-sm select-none ${sizeClasses[size]} ${className}`}
    >
      {initials || <UserIcon className="w-1/2 h-1/2" />}
    </div>
  );
}
