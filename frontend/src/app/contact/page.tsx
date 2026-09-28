"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";
import { supportApi, SupportTicketItem } from "@/lib/api/support";

import { ContactHero } from "@/components/contact/ContactHero";
import { ContactCategories } from "@/components/contact/ContactCategories";
import { ContactTicketForm } from "@/components/contact/ContactTicketForm";
import { ContactUserTickets } from "@/components/contact/ContactUserTickets";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { ContactInfo } from "@/components/contact/ContactInfo";
import { ContactFinalCTA } from "@/components/contact/ContactFinalCTA";

export default function ContactPage() {
  const { isLoggedIn } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>("TECHNICAL_ISSUE");
  const [userTickets, setUserTickets] = useState<SupportTicketItem[]>([]);
  const [loadingTickets, setLoadingTickets] = useState<boolean>(false);

  const fetchTickets = useCallback(async () => {
    if (!isLoggedIn) {
      setUserTickets([]);
      return;
    }
    setLoadingTickets(true);
    try {
      const res = await supportApi.getUserTickets();
      if (res.success && res.data?.tickets) {
        setUserTickets(res.data.tickets);
      }
    } catch (err) {
      console.error("Failed to load user support tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const activeTicketsCount = userTickets.filter(
    (t) => t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "WAITING_FOR_USER"
  ).length;

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    scrollToSection("support-form");
  };

  const handleTicketCreated = (newTicket: SupportTicketItem) => {
    setUserTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <ContactHero
          activeTicketsCount={activeTicketsCount}
          isLoggedIn={isLoggedIn}
          onScrollToForm={() => scrollToSection("support-form")}
          onScrollToFaq={() => scrollToSection("faq-section")}
        />

        {/* 2. Contact Options / Categories */}
        <ContactCategories onSelectCategory={handleSelectCategory} />

        {/* 3. Support Ticket Form */}
        <ContactTicketForm
          selectedCategory={selectedCategory}
          onTicketCreated={handleTicketCreated}
        />

        {/* 4. My Support Requests */}
        <ContactUserTickets
          tickets={userTickets}
          loading={loadingTickets}
          isLoggedIn={isLoggedIn}
          onRefresh={fetchTickets}
        />

        {/* 5. FAQ Section */}
        <ContactFAQ />

        {/* 6. Support Information (Direct Channels) */}
        <ContactInfo />

        {/* 7. Final CTA */}
        <ContactFinalCTA onScrollToForm={() => scrollToSection("support-form")} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
