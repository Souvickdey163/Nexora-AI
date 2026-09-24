"use client";

import React, { useState, useEffect } from "react";
import { Bell, CheckCheck, X, Sparkles, Info, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";
import { notificationApi, InAppNotification } from "@/lib/api/notifications";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export function NotificationDrawer() {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    const res = await notificationApi.getNotifications();
    if (res.success) {
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await notificationApi.markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await notificationApi.markAllAsRead();
  };

  if (!isLoggedIn) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-2 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-3 animate-fadeIn"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-semibold text-slate-500 hover:text-sky-500 flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {loading && notifications.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">All caught up!</p>
                <p className="text-[10px] text-slate-400 mt-1">No new notifications right now.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    item.isRead
                      ? "bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-850 opacity-70"
                      : "bg-sky-50/40 dark:bg-sky-950/30 border-sky-200/60 dark:border-sky-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      {item.type === "CREDIT" ? (
                        <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : item.type === "SUCCESS" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : item.type === "WARNING" ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">{item.message}</p>
                        <p className="text-[9px] text-slate-400 mt-1">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    {item.linkUrl && (
                      <Link
                        href={item.linkUrl}
                        onClick={() => setIsOpen(false)}
                        className="text-sky-500 hover:text-sky-600 shrink-0 mt-0.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
