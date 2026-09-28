"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Eye,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  LogIn,
} from "lucide-react";
import { SupportTicketItem } from "@/lib/api/support";

interface ContactUserTicketsProps {
  tickets: SupportTicketItem[];
  loading: boolean;
  isLoggedIn: boolean;
  onRefresh: () => void;
}

export const ContactUserTickets: React.FC<ContactUserTicketsProps> = ({
  tickets,
  loading,
  isLoggedIn,
  onRefresh,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<SupportTicketItem | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "IN_PROGRESS":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "WAITING_FOR_USER":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "RESOLVED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "CLOSED":
        return "bg-slate-800 text-slate-400 border-slate-700";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "text-rose-400 bg-rose-500/10 border-rose-500/30";
      case "HIGH":
        return "text-orange-400 bg-orange-500/10 border-orange-500/30";
      case "MEDIUM":
        return "text-amber-400 bg-amber-500/10 border-amber-500/30";
      default:
        return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    }
  };

  return (
    <section id="my-tickets" className="py-20 lg:py-28 bg-slate-900/60 relative border-t border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>TICKET HISTORY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              My Support Requests
            </h2>
          </div>

          {isLoggedIn && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-slate-300 hover:text-white rounded-xl border border-slate-800 text-xs font-semibold flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh Tickets</span>
            </button>
          )}
        </div>

        {/* Content States */}
        {!isLoggedIn ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-950 border border-slate-800 text-center max-w-md mx-auto space-y-4">
            <LogIn className="w-10 h-10 text-cyan-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Sign in to view your tickets</h3>
            <p className="text-xs text-slate-400">
              Track real-time status updates and admin responses for all your support tickets.
            </p>
            <a
              href="/auth"
              className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition"
            >
              Sign In Now
            </a>
          </div>
        ) : loading ? (
          <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-16 bg-slate-900 rounded-xl" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          /* Empty State */
          <div className="p-12 rounded-3xl bg-slate-950 border border-slate-800 text-center max-w-md mx-auto space-y-4">
            <LifeBuoy className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No support requests yet.</h3>
            <p className="text-xs text-slate-400">
              When you submit a support ticket above, it will appear here with real-time status updates.
            </p>
          </div>
        ) : (
          /* Table / Grid list of tickets */
          <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider">
                    <th className="py-4 px-4 sm:px-6">Ticket ID</th>
                    <th className="py-4 px-4 sm:px-6">Subject</th>
                    <th className="py-4 px-4 sm:px-6">Category</th>
                    <th className="py-4 px-4 sm:px-6">Priority</th>
                    <th className="py-4 px-4 sm:px-6">Status</th>
                    <th className="py-4 px-4 sm:px-6">Date</th>
                    <th className="py-4 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-medium text-slate-300">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/50 transition">
                      <td className="py-4 px-4 sm:px-6 font-mono font-extrabold text-cyan-400">
                        {t.ticketNumber}
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-semibold text-white max-w-[200px] truncate">
                        {t.subject}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-400">
                        {t.category}
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityBadge(t.priority)}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-cyan-300 rounded-lg font-semibold flex items-center gap-1.5 ml-auto border border-slate-800 transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Detailed Ticket Modal */}
        <AnimatePresence>
          {selectedTicket && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-mono font-extrabold text-cyan-400">
                      TICKET {selectedTicket.ticketNumber}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      {selectedTicket.subject}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Metadata Badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className={`px-3 py-1 rounded-full font-bold border ${getStatusBadge(selectedTicket.status)}`}>
                    Status: {selectedTicket.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-bold border ${getPriorityBadge(selectedTicket.priority)}`}>
                    Priority: {selectedTicket.priority}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Category: {selectedTicket.category}
                  </span>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</h4>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description}
                  </div>
                </div>

                {/* Attachment URL if any */}
                {selectedTicket.attachmentUrl && (
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attachment Link</h4>
                    <a
                      href={selectedTicket.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 underline truncate block"
                    >
                      {selectedTicket.attachmentUrl}
                    </a>
                  </div>
                )}

                {/* Admin Response if present */}
                {selectedTicket.adminResponse && (
                  <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                    <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Support Team Response</h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {selectedTicket.adminResponse}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                <div className="pt-4 border-t border-slate-800 flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>Created: {new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  <span>Updated: {new Date(selectedTicket.updatedAt).toLocaleString()}</span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
