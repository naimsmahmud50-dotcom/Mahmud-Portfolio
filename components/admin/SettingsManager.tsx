"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Globe, Phone, Share2, Search } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "./ToastContext";

interface SiteSettingsForm {
  name: string;
  title: string;
  tagline: string;
  location: string;
  timeZone: string;
  email: string;
  phone: string;
  whatsapp: string;
  telegram: string;
  github: string;
  linkedin: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
}

export default function SettingsManager() {
  const [form, setForm] = useState<SiteSettingsForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.data) {
          setForm(res.data);
        }
      })
      .catch(() => toast("Failed to load settings", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast("Site Settings saved and published live!", "success");
      } else {
        toast(data.error || "Failed to update settings", "error");
      }
    } catch {
      toast("Error saving settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Site Settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Global Identity */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Global Identity</h3>
            <p className="text-xs font-mono text-muted">Core profile and editorial branding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Primary Location
            </label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Professional Title / Role
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Editorial Tagline
            </label>
            <textarea
              rows={2}
              required
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* 2. Direct Contact Channels */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Verified Contact Channels</h3>
            <p className="text-xs font-mono text-muted">Channels used in Footer, Contact page, and floating triggers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Primary Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Phone Number
            </label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              WhatsApp Direct Link
            </label>
            <input
              type="url"
              required
              placeholder="https://wa.me/..."
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-mono text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Telegram URL / Username
            </label>
            <input
              type="url"
              required
              placeholder="https://t.me/..."
              value={form.telegram}
              onChange={(e) => setForm({ ...form, telegram: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-mono text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* 3. Social Handles */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Share2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Developer &amp; Career Profiles</h3>
            <p className="text-xs font-mono text-muted">GitHub repository link and LinkedIn profile URL</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              GitHub Profile URL
            </label>
            <input
              type="url"
              required
              value={form.github}
              onChange={(e) => setForm({ ...form, github: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-mono text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              LinkedIn Profile URL
            </label>
            <input
              type="url"
              required
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-mono text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* 4. Global SEO & Social Sharing */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Search className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Global SEO &amp; Open Graph</h3>
            <p className="text-xs font-mono text-muted">Search engine metadata and social link preview card</p>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Meta Description
            </label>
            <textarea
              rows={3}
              required
              value={form.seoDescription}
              onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Meta Keywords (comma-separated)
            </label>
            <input
              type="text"
              required
              value={form.seoKeywords}
              onChange={(e) => setForm({ ...form, seoKeywords: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <ImageUploadField
            label="Open Graph Share Image (1200x630 Recommended)"
            value={form.ogImageUrl}
            onChange={(url) => setForm({ ...form, ogImageUrl: url })}
            helperText="Upload or enter URL for LinkedIn/Twitter/WhatsApp preview card"
          />
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-6 z-30 p-4 rounded-2xl bg-surface/90 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-4">
        <p className="text-xs font-mono text-muted hidden sm:block">
          Changes will propagate live across root layout, metadata &amp; footer
        </p>

        <button
          type="submit"
          disabled={saving}
          className="ml-auto px-6 py-3 rounded-full bg-accent text-accent-ink font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer shadow-lg"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
