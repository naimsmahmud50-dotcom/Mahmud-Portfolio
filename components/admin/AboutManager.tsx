"use client";

import React, { useState, useEffect } from "react";
import { User, FileText, Save, Loader2 } from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import { useToast } from "./ToastContext";

interface AboutData {
  heroHeadlineEn: string;
  heroHeadlineBn: string;
  storyP1En: string;
  storyP1Bn: string;
  storyP2En: string;
  storyP2Bn: string;
  storyP3En: string;
  storyP3Bn: string;
  avatarUrl: string;
  cvUrl: string;
  locationEn: string;
  locationBn: string;
}

export default function AboutManager() {
  const [form, setForm] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.data) {
          setForm(res.data);
        }
      })
      .catch(() => toast("Failed to load about section data", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast("About section successfully updated and revalidated!", "success");
      } else {
        toast(data.error || "Failed to update about section", "error");
      }
    } catch {
      toast("Network error updating about section", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading About configurations...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Profile Avatar & CV Link */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Profile Media &amp; Resume</h3>
            <p className="text-xs font-mono text-muted">Author photograph and public CV link</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <ImageUploadField
            label="Profile Avatar Photo"
            value={form.avatarUrl}
            onChange={(url) => setForm({ ...form, avatarUrl: url })}
            helperText="Recommended: 800x800 square portrait. Max 5MB."
          />

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                CV / Resume URL or Path
              </label>
              <input
                type="text"
                required
                value={form.cvUrl}
                onChange={(e) => setForm({ ...form, cvUrl: e.target.value })}
                placeholder="/cv.pdf or Google Drive link"
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
              />
              <p className="text-[11px] font-mono text-muted mt-1.5">
                Path to local PDF in public folder or direct cloud download link.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Location (English)
                </label>
                <input
                  type="text"
                  required
                  value={form.locationEn}
                  onChange={(e) => setForm({ ...form, locationEn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Location (Bengali)
                </label>
                <input
                  type="text"
                  required
                  value={form.locationBn}
                  onChange={(e) => setForm({ ...form, locationBn: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Headline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">About Page Headline</h3>
            <p className="text-xs font-mono text-muted">Large editorial marquee headline introducing the story</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Headline (English)
            </label>
            <textarea
              rows={3}
              required
              value={form.heroHeadlineEn}
              onChange={(e) => setForm({ ...form, heroHeadlineEn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Headline (Bengali)
            </label>
            <textarea
              rows={3}
              required
              value={form.heroHeadlineBn}
              onChange={(e) => setForm({ ...form, heroHeadlineBn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Story Narrative (3 Paragraphs) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h3 className="font-display font-bold text-lg text-foreground">Narrative Paragraphs</h3>
          <p className="text-xs font-mono text-muted">Three-part deep editorial narrative</p>
        </div>

        {/* Paragraph 1 */}
        <div className="space-y-3 pt-2">
          <span className="text-xs font-mono text-accent font-bold">Paragraph 1 — Identity &amp; Foundations</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-muted mb-1">English</label>
              <textarea
                rows={4}
                required
                value={form.storyP1En}
                onChange={(e) => setForm({ ...form, storyP1En: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">Bengali</label>
              <textarea
                rows={4}
                required
                value={form.storyP1Bn}
                onChange={(e) => setForm({ ...form, storyP1Bn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Paragraph 2 */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <span className="text-xs font-mono text-accent font-bold">Paragraph 2 — Engineering Philosophy</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-muted mb-1">English</label>
              <textarea
                rows={4}
                required
                value={form.storyP2En}
                onChange={(e) => setForm({ ...form, storyP2En: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">Bengali</label>
              <textarea
                rows={4}
                required
                value={form.storyP2Bn}
                onChange={(e) => setForm({ ...form, storyP2Bn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Paragraph 3 */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <span className="text-xs font-mono text-accent font-bold">Paragraph 3 — Market Impact &amp; Scaling</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-mono text-muted mb-1">English</label>
              <textarea
                rows={4}
                required
                value={form.storyP3En}
                onChange={(e) => setForm({ ...form, storyP3En: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-muted mb-1">Bengali</label>
              <textarea
                rows={4}
                required
                value={form.storyP3Bn}
                onChange={(e) => setForm({ ...form, storyP3Bn: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publishing Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save About Section</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
