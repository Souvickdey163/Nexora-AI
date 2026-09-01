"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setStoredAccessToken } from "@/lib/api/auth";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      setStoredAccessToken(token);
      router.push("/dashboard");
    } else if (error) {
      router.push(`/auth?error=${encodeURIComponent(error)}`);
    } else {
      router.push("/auth");
    }
  }, [router, searchParams]);

  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
      <h2 className="text-xl font-bold">Completing Authentication...</h2>
      <p className="text-slate-400 text-sm">Please wait while we redirect you to your dashboard.</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <Suspense fallback={
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-xl font-bold">Loading...</h2>
        </div>
      }>
        <CallbackHandler />
      </Suspense>
    </div>
  );
}
