"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Save, Loader2, Plus, X, Type, Radio } from "lucide-react";
import { useToast } from "./ToastContext";

interface HeroData {
  badgeEn: string;
  badgeBn: string;
  name: string;
  dash: string;
  introEn: string;
  introBn: string;
  positioningEn: string;
  positioningBn: string;
  availableBadgeEn: string;
  availableBadgeBn: string;
  roles: string;
}

export default function HeroManager() {
  const [form, setForm] = useState<HeroData | null>(null);
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((res) => {
        if (res && res.data) {
          setForm(res.data);
          try {
            const parsed = typeof res.data.roles === "string" ? JSON.parse(res.data.roles) : res.data.roles;
            setRolesList(Array.isArray(parsed) ? parsed : []);
          } catch {
            setRolesList([]);
          }
        }
      })
      .catch(() => toast("Failed to load hero configuration", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  const handleAddRole = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newRole.trim();
    if (!trimmed) return;
    if (rolesList.includes(trimmed)) {
      toast("Role already exists in list", "error");
      return;
    }
    setRolesList([...rolesList, trimmed]);
    setNewRole("");
  };

  const handleRemoveRole = (roleToRemove: string) => {
    setRolesList(rolesList.filter((r) => r !== roleToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    try {
      const payload = {
        ...form,
        roles: JSON.stringify(rolesList),
      };

      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast("Hero section successfully updated and revalidated!", "success");
      } else {
        toast(data.error || "Failed to update hero section", "error");
      }
    } catch {
      toast("Network error updating hero section", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Hero configurations...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Header & Badges */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Hero Heading &amp; Badges</h3>
            <p className="text-xs font-mono text-muted">Primary editorial headline and sub-badges</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Primary Display Name
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
              Em Dash / Accent Character
            </label>
            <input
              type="text"
              required
              value={form.dash}
              onChange={(e) => setForm({ ...form, dash: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Top Badge (English)
            </label>
            <input
              type="text"
              required
              value={form.badgeEn}
              onChange={(e) => setForm({ ...form, badgeEn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Top Badge (Bengali)
            </label>
            <input
              type="text"
              required
              value={form.badgeBn}
              onChange={(e) => setForm({ ...form, badgeBn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* 2. Availability & Status */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Availability Status Pill</h3>
            <p className="text-xs font-mono text-muted">Signals live availability status in the hero badge</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Availability Pill (English)
            </label>
            <input
              type="text"
              required
              value={form.availableBadgeEn}
              onChange={(e) => setForm({ ...form, availableBadgeEn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Availability Pill (Bengali)
            </label>
            <input
              type="text"
              required
              value={form.availableBadgeBn}
              onChange={(e) => setForm({ ...form, availableBadgeBn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* 3. Positioning & Intro Paragraphs */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Positioning &amp; Statement</h3>
            <p className="text-xs font-mono text-muted">Hero description copy for English and Bengali visitors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Intro Paragraph (English)
            </label>
            <textarea
              rows={4}
              required
              value={form.introEn}
              onChange={(e) => setForm({ ...form, introEn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Intro Paragraph (Bengali)
            </label>
            <textarea
              rows={4}
              required
              value={form.introBn}
              onChange={(e) => setForm({ ...form, introBn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Positioning Statement (English)
            </label>
            <textarea
              rows={3}
              required
              value={form.positioningEn}
              onChange={(e) => setForm({ ...form, positioningEn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
              Positioning Statement (Bengali)
            </label>
            <textarea
              rows={3}
              required
              value={form.positioningBn}
              onChange={(e) => setForm({ ...form, positioningBn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>
        </div>
      </div>

      {/* 4. Marquee Roles / Subheadings */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="font-display font-bold text-lg text-foreground">Architectural Roles</h3>
            <p className="text-xs font-mono text-muted">Specializations displayed in the hero ticker marquee</p>
          </div>
          <span className="text-xs font-mono text-accent">
            {rolesList.length} Active Roles
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {rolesList.map((role, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-raised border border-white/10 text-xs font-mono text-foreground group"
            >
              <span>{role}</span>
              <button
                type="button"
                onClick={() => handleRemoveRole(role)}
                className="text-muted hover:text-red-400 transition-colors"
                title="Remove role"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {rolesList.length === 0 && (
            <p className="text-xs font-mono text-muted italic">No roles added yet.</p>
          )}
        </div>

        <div className="flex gap-2 max-w-md">
          <input
            type="text"
            placeholder="e.g. LLM Security Orchestrator"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddRole();
              }
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-surface-raised border border-white/10 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => handleAddRole()}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-accent text-xs font-mono text-foreground hover:text-accent flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Role</span>
          </button>
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
              <span>Save Hero Section</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
