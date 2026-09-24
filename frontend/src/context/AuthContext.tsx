"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi, getStoredAccessToken, clearStoredAuth } from "@/lib/api/auth";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  role?: string;
  isEmailVerified?: boolean;
  avatar?: string | null;
  avatarUrl?: string | null;
  credits?: number;
  profile?: any;
  connectedAccounts?: string[];
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
  updateUser: (partial: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  logout: async () => {},
  refreshUser: async () => {},
  updateCredits: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    const token = getStoredAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Load initial cached user from localStorage for immediate UI render
    const cachedUserStr = localStorage.getItem("nexora_user");
    if (cachedUserStr) {
      try {
        const cachedUser = JSON.parse(cachedUserStr);
        setUser(cachedUser);
      } catch {
        // Ignore JSON parse errors
      }
    }

    // Verify token & fetch fresh user profile from backend /api/auth/me
    try {
      const res = await authApi.getCurrentUser();
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem("nexora_user", JSON.stringify(res.data.user));
      } else if (res.success === false && res.code === "UNAUTHORIZED") {
        // Token invalid or expired
        clearStoredAuth();
        setUser(null);
      }
    } catch (err) {
      console.error("Auth sync error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCredits = useCallback((newCredits: number) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, credits: newCredits };
      if (typeof window !== "undefined") {
        localStorage.setItem("nexora_user", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const updateUser = useCallback((partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...partial };
      if (typeof window !== "undefined") {
        localStorage.setItem("nexora_user", JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout request error:", err);
    } finally {
      clearStoredAuth();
      setUser(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("nexora-auth-change"));
      }
    }
  }, []);

  useEffect(() => {
    refreshUser();

    const handleAuthChange = () => {
      refreshUser();
    };

    window.addEventListener("nexora-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("nexora-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        loading,
        logout,
        refreshUser,
        updateCredits,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
