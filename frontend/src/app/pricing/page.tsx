"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Zap,
  Check,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  History,
  ArrowRight,
  Loader2,
  FileText,
  Video,
  Bot,
  GitBranch,
  MapPin,
  Award,
} from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { paymentsApi, CreditPackage } from "@/lib/api/payments";
import { creditsApi } from "@/lib/api/credits";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PricingPage() {
  const { user, isLoggedIn, updateCredits } = useAuth();
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [purchasingPkgId, setPurchasingPkgId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Load packages from backend
    async function loadPackages() {
      try {
        const res = await paymentsApi.getPackages();
        if (res.success && res.data?.packages) {
          setPackages(res.data.packages);
        }
      } catch (err) {
        console.error("Failed to load pricing packages:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  // Dynamically load Razorpay Checkout Script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePurchase = async (packageId: string) => {
    if (!isLoggedIn) {
      window.location.href = "/auth";
      return;
    }

    setPurchasingPkgId(packageId);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Call backend create-order API
      const orderRes = await paymentsApi.createOrder(packageId);
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.error || "Failed to create payment order");
      }

      const { orderId, amount, currency, keyId } = orderRes.data;

      // 2. Configure Razorpay Checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Nexora AI",
        description: `Purchase ${packageId} Package`,
        image: "/favicon.ico",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            setPurchasingPkgId(packageId);
            // 3. Call backend verify-payment API
            const verifyRes = await paymentsApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.success && verifyRes.data) {
              setSuccessMsg(
                `🎉 Success! Added ${verifyRes.data.creditsGranted} credits to your account.`
              );
              updateCredits(verifyRes.data.credits);
            } else {
              throw new Error(verifyRes.error || "Payment verification failed.");
            }
          } catch (err: any) {
            setErrorMsg(err.message || "Payment verification error occurred.");
          } finally {
            setPurchasingPkgId(null);
          }
        },
        prefill: {
          name: user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.email || "",
        },
        theme: {
          color: "#0284c7",
        },
        modal: {
          ondismiss: function () {
            setPurchasingPkgId(null);
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fallback for environment/test simulation
        const mockVerifyRes = await paymentsApi.verifyPayment({
          razorpayOrderId: orderId,
          razorpayPaymentId: `pay_sim_${Date.now()}`,
          razorpaySignature: "mock_signature_test",
        });
        if (mockVerifyRes.success && mockVerifyRes.data) {
          setSuccessMsg(
            `🎉 Test Mode Success! Added ${mockVerifyRes.data.creditsGranted} credits to your account.`
          );
          updateCredits(mockVerifyRes.data.credits);
        }
        setPurchasingPkgId(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Payment initialization failed.");
      setPurchasingPkgId(null);
    }
  };

  const fetchHistory = async () => {
    setShowHistory(true);
    setHistoryLoading(true);
    try {
      const res = await creditsApi.getHistory();
      if (res.success && res.data?.transactions) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-16">
        {/* HERO SECTION */}
        <section className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-400/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pay As You Go • Simple Credit Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            Power your career with <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Nexora AI</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium">
            Start with <strong className="text-slate-900 dark:text-white font-bold">10 free credits</strong>. Upgrade whenever you need more. No subscriptions, no hidden fees.
          </p>

          {/* CURRENT BALANCE BADGE */}
          {isLoggedIn && (
            <div className="pt-2 inline-flex items-center gap-4 p-3 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-500 fill-current animate-pulse" />
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Your Current Balance:</span>
                <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">
                  ⚡ {user?.credits ?? 0} Credits
                </span>
              </div>
              <button
                onClick={fetchHistory}
                className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                <History className="w-3.5 h-3.5" />
                <span>History</span>
              </button>
            </div>
          )}
        </section>

        {/* FEEDBACK BANNERS */}
        {errorMsg && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-semibold text-center animate-fadeIn">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="max-w-xl mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center animate-fadeIn">
            {successMsg}
          </div>
        )}

        {/* PRICING PACKAGES GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {(packages.length > 0 ? packages : defaultPackages).map((pkg) => {
            const isPurchasing = purchasingPkgId === pkg.id;
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-300 ${
                  pkg.popular
                    ? "bg-white dark:bg-slate-900 border-2 border-sky-500 shadow-2xl shadow-sky-500/10 scale-105"
                    : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl"
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-[10px] font-black tracking-wider uppercase shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{pkg.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                      ₹{pkg.priceInINR}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">one-time</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Credits Included</span>
                    <span className="text-base font-extrabold text-sky-600 dark:text-sky-400">⚡ {pkg.credits}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Never expire</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Access all AI features</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Instant Razorpay checkout</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => handlePurchase(pkg.id)}
                    disabled={isPurchasing}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl font-bold text-xs tracking-wide transition-all ${
                      pkg.popular
                        ? "bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white shadow-lg shadow-sky-500/25"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"
                    }`}
                  >
                    {isPurchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Order...</span>
                      </>
                    ) : (
                      <>
                        <span>Get {pkg.credits} Credits</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* WHAT CAN I USE CREDITS FOR? */}
        <section className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              What can I use credits for?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Only actual AI and computational operations consume credits. Browsing and viewing past reports are free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <CreditCostCard
              icon={<FileText className="w-5 h-5 text-indigo-500" />}
              title="Resume AI Analysis"
              cost="2 Credits"
              description="ATS score optimization, section breakdown, and tailored bullet recommendations."
            />
            <CreditCostCard
              icon={<Video className="w-5 h-5 text-cyan-500" />}
              title="AI Mock Interview"
              cost="3 Credits"
              description="Technical & behavioral practice sessions with instant rubric evaluations."
            />
            <CreditCostCard
              icon={<Video className="w-5 h-5 text-emerald-500" />}
              title="Live AI Voice & Video Interview"
              cost="5 Credits"
              description="Real-time conversational voice interview with speech clarity and body language signals."
            />
            <CreditCostCard
              icon={<Bot className="w-5 h-5 text-emerald-500" />}
              title="Nexus AI Chatbot Message"
              cost="0 Credits (FREE)"
              description="Unlimited direct AI career advice, code reviews, and placement guidance."
            />
            <CreditCostCard
              icon={<GitBranch className="w-5 h-5 text-purple-500" />}
              title="GitHub Repository Analysis"
              cost="2 Credits"
              description="In-depth code quality audit, architecture review, and resume bullet synthesis."
            />
            <CreditCostCard
              icon={<MapPin className="w-5 h-5 text-amber-500" />}
              title="Roadmap & Skill Assessment"
              cost="2 Credits"
              description="Customized career roadmaps and technical skill verification tests."
            />
          </div>
        </section>

        {/* CREDIT HISTORY MODAL / EXPANDED SECTION */}
        {showHistory && (
          <section className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-sky-500" />
                <span>Credit Transaction Ledger</span>
              </h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
              >
                Close
              </button>
            </div>

            {historyLoading ? (
              <div className="py-8 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-sky-500" />
                <span>Loading transaction ledger...</span>
              </div>
            ) : transactions.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-500">No transactions recorded yet.</p>
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
                        <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                          {tx.type}
                        </td>
                        <td
                          className={`py-2.5 px-3 font-extrabold ${
                            tx.amount > 0 ? "text-emerald-500" : "text-rose-500"
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                          {tx.description || tx.source}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* FAQ SECTION */}
        <section className="space-y-6 max-w-3xl mx-auto pt-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <FaqItem
              question="Do credits expire?"
              answer="No! Your purchased credits never expire. Use them whenever you need interview practice or resume optimization."
            />
            <FaqItem
              question="Can I test Nexora before buying credits?"
              answer="Yes! Every newly registered Nexora account automatically receives 10 free credits to test all features."
            />
            <FaqItem
              question="Is payment secure?"
              answer="Absolutely. All payments are processed through Razorpay using industry-standard 256-bit SSL encryption. Nexora never stores your card or banking details."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function CreditCostCard({
  icon,
  title,
  cost,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  cost: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon}
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h4>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-[11px] font-extrabold border border-sky-500/20">
          {cost}
        </span>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{question}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{answer}</p>
    </div>
  );
}

const defaultPackages: CreditPackage[] = [
  {
    id: "STARTER",
    name: "Starter Pack",
    credits: 50,
    priceInINR: 199,
    amountInPaise: 19900,
    description: "Perfect for quick resume reviews and practice interviews.",
  },
  {
    id: "GROWTH",
    name: "Growth Pack",
    credits: 150,
    priceInINR: 499,
    amountInPaise: 49900,
    popular: true,
    description: "Ideal for active job seekers preparing for interviews.",
  },
  {
    id: "PRO",
    name: "Pro Career Pack",
    credits: 500,
    priceInINR: 1299,
    amountInPaise: 129900,
    description: "Complete career transformation pack with maximum value.",
  },
];
