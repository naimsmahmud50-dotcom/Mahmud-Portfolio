"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderGit2,
  Sparkles,
  User,
  Cpu,
  Wrench,
  MessageSquareQuote,
  Briefcase,
  Settings,
  Mail,
  ExternalLink,
  LogOut,
  Loader2,
} from "lucide-react";
import { ToastProvider } from "@/components/admin/ToastContext";
import SettingsManager from "@/components/admin/SettingsManager";
import HeroManager from "@/components/admin/HeroManager";
import AboutManager from "@/components/admin/AboutManager";
import SkillsManager from "@/components/admin/SkillsManager";
import ProjectsManager from "@/components/admin/ProjectsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import ExperienceManager from "@/components/admin/ExperienceManager";
import MessagesInbox from "@/components/admin/MessagesInbox";

type AdminTab =
  | "projects"
  | "hero"
  | "about"
  | "skills"
  | "services"
  | "testimonials"
  | "experience"
  | "settings"
  | "messages";

function AdminDashboardContent() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    services: 0,
  });

  // Verify server-side session
  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.authenticated) {
          setIsAuthenticated(true);
        } else {
          router.push("/admin/login?from=/admin");
        }
      })
      .catch(() => {
        router.push("/admin/login?from=/admin");
      });
  }, [router]);

  // Load KPI stats and message counts
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("/api/projects")
      .then((r) => r.json())
      .then((d) => d?.data && setStats((prev) => ({ ...prev, projects: d.data.length })))
      .catch(() => {});

    fetch("/api/skills")
      .then((r) => r.json())
      .then((d) => d?.data && setStats((prev) => ({ ...prev, skills: d.data.length })))
      .catch(() => {});

    fetch("/api/services")
      .then((r) => r.json())
      .then((d) => d?.data && setStats((prev) => ({ ...prev, services: d.data.length })))
      .catch(() => {});

    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => {
        if (typeof d?.unreadCount === "number") {
          setUnreadMessages(d.unreadCount);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    sessionStorage.removeItem("mahmud_admin_auth");
    router.push("/admin/login");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-muted gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-accent" />
        <span>Authenticating admin credentials...</span>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "projects", label: "Projects", icon: FolderGit2, badge: stats.projects },
    { id: "hero", label: "Hero Section", icon: Sparkles },
    { id: "about", label: "About & Story", icon: User },
    { id: "skills", label: "Skills Catalog", icon: Cpu, badge: stats.skills },
    { id: "services", label: "Services", icon: Wrench, badge: stats.services },
    { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "settings", label: "Site Settings", icon: Settings },
    { id: "messages", label: "Inquiries", icon: Mail, badge: unreadMessages },
  ];

  return (
    <div className="pt-28 pb-32 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5 text-xs font-mono text-accent uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SQLite Active • Real-time Revalidation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
            Mahmud Hasan Control Deck
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl border border-white/10 hover:border-accent text-xs font-mono text-muted hover:text-white flex items-center gap-2 transition-colors"
          >
            <span>Live Portfolio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock Session</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-white/10">
          <p className="text-xs font-mono text-muted uppercase">Live Projects</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">
            {stats.projects}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
            ✓ In Active Production
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-white/10">
          <p className="text-xs font-mono text-muted uppercase">Technical Skills</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">
            {stats.skills}
          </p>
          <span className="text-[11px] font-mono text-accent mt-2 block">
            5 Domains Categorized
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-white/10">
          <p className="text-xs font-mono text-muted uppercase">Service Offerings</p>
          <p className="text-3xl font-display font-bold text-foreground mt-2">
            {stats.services}
          </p>
          <span className="text-[11px] font-mono text-muted mt-2 block">
            Bilingual Scope
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-white/10">
          <p className="text-xs font-mono text-muted uppercase">Inbound Inquiries</p>
          <p className="text-3xl font-display font-bold text-accent mt-2">
            {unreadMessages}
          </p>
          <span className="text-[11px] font-mono text-emerald-400 mt-2 block">
            {unreadMessages > 0 ? "Awaiting Review" : "All Caught Up"}
          </span>
        </div>
      </div>

      {/* Section Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-surface border border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-accent text-accent-ink shadow-md"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.badge === "number" && tab.badge > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-black/20 text-accent-ink"
                      : "bg-white/10 text-accent"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Screen */}
      <div>
        {activeTab === "projects" && <ProjectsManager />}
        {activeTab === "hero" && <HeroManager />}
        {activeTab === "about" && <AboutManager />}
        {activeTab === "skills" && <SkillsManager />}
        {activeTab === "services" && <ServicesManager />}
        {activeTab === "testimonials" && <TestimonialsManager />}
        {activeTab === "experience" && <ExperienceManager />}
        {activeTab === "settings" && <SettingsManager />}
        {activeTab === "messages" && <MessagesInbox />}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ToastProvider>
      <AdminDashboardContent />
    </ToastProvider>
  );
}
