"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  href?: string;
  className?: string;
  variant?: "auto" | "light" | "dark";
  textColor?: string;
}

const sizeMap = {
  sm: { icon: 28, box: "w-8 h-8", text: "text-lg" },
  md: { icon: 36, box: "w-10 h-10", text: "text-xl" },
  lg: { icon: 48, box: "w-14 h-14", text: "text-2xl" },
  xl: { icon: 64, box: "w-20 h-20", text: "text-4xl" },
};

export function NexoraLogo({
  size = "md",
  showText = true,
  href = "/",
  className = "",
  variant = "auto",
  textColor,
}: LogoProps) {
  const { icon, box, text } = sizeMap[size];

  const brandTextColor = textColor
    ? textColor
    : variant === "light"
    ? "text-white"
    : variant === "dark"
    ? "text-slate-900"
    : "text-slate-900 dark:text-white";

  const dotAiColor =
    variant === "light"
      ? "text-sky-400"
      : variant === "dark"
      ? "text-sky-600"
      : "text-sky-500 dark:text-sky-400";

  const logoSrc =
    variant === "light"
      ? "/logo-nexora-light.png"
      : "/logo-nexora.png";

  const logoContent = (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Logo Icon Badge */}
      <div
        className={`relative ${box} rounded-xl bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-md shadow-sky-500/10 border border-slate-200/80 dark:border-sky-500/30 group-hover:border-sky-400 group-hover:scale-105 transition-all duration-300 overflow-hidden`}
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Image
          src={logoSrc}
          alt="Nexora AI Logo"
          width={icon}
          height={icon}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(56,189,248,0.2)]"
          priority
        />
      </div>

      {/* Brand Name Text */}
      {showText && (
        <span className={`font-bold ${text} tracking-tight ${brandTextColor}`}>
          Nexora<span className={dotAiColor}>.ai</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-xl">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
