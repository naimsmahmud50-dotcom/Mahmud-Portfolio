"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Star,
  Loader2,
  X,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastContext";

export interface ExperienceItem {
  id: string;
  period: string;
  roleEn: string;
  roleBn: string;
  company: string;
  location: string;
  descriptionEn: string;
  descriptionBn: string;
  technologies: string[];
  featured: boolean;
  order: number;
}

export default function ExperienceManager() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ExperienceItem | null>(null);

  // Form State
  const [period, setPeriod] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [roleBn, setRoleBn] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("Dhaka, Bangladesh");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState("");
  const [featured, setFeatured] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExperienceItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchExperiences = useCallback(() => {
    fetch("/api/experiences")
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setExperiences(res.data);
        }
      })
      .catch(() => toast("Failed to load experience history", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const openCreateModal = () => {
    setEditingExperience(null);
    setPeriod("2024 — Present");
    setRoleEn("");
    setRoleBn("");
    setCompany("");
    setLocation("Dhaka, Bangladesh");
    setDescriptionEn("");
    setDescriptionBn("");
    setTechnologies(["Next.js", "TypeScript", "Node.js"]);
    setTechInput("");
    setFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (exp: ExperienceItem) => {
    setEditingExperience(exp);
    setPeriod(exp.period);
    setRoleEn(exp.roleEn);
    setRoleBn(exp.roleBn);
    setCompany(exp.company);
    setLocation(exp.location);
    setDescriptionEn(exp.descriptionEn);
    setDescriptionBn(exp.descriptionBn);
    setTechnologies(Array.isArray(exp.technologies) ? exp.technologies : []);
    setTechInput("");
    setFeatured(exp.featured);
    setModalOpen(true);
  };

  const handleAddTech = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = techInput.trim();
    if (!val) return;
    if (technologies.includes(val)) {
      toast("Technology already added", "error");
      return;
    }
    setTechnologies([...technologies, val]);
    setTechInput("");
  };

  const handleRemoveTech = (item: string) => {
    setTechnologies(technologies.filter((t) => t !== item));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!period.trim() || !company.trim()) {
      toast("Period and company are required", "error");
      return;
    }
    if (!roleEn.trim() || !roleBn.trim()) {
      toast("English and Bengali roles are required", "error");
      return;
    }
    if (!descriptionEn.trim() || !descriptionBn.trim()) {
      toast("English and Bengali descriptions are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        period: period.trim(),
        roleEn: roleEn.trim(),
        roleBn: roleBn.trim(),
        company: company.trim(),
        location: location.trim() || "Dhaka, Bangladesh",
        descriptionEn: descriptionEn.trim(),
        descriptionBn: descriptionBn.trim(),
        technologies,
        featured,
        order: editingExperience ? editingExperience.order : experiences.length,
      };

      const url = editingExperience ? `/api/experiences/${editingExperience.id}` : "/api/experiences";
      const method = editingExperience ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast(editingExperience ? "Experience updated successfully" : "Experience milestone added", "success");
        setModalOpen(false);
        fetchExperiences();
      } else {
        toast(data.error || "Failed to save experience", "error");
      }
    } catch {
      toast("Network error saving experience", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (exp: ExperienceItem) => {
    try {
      const res = await fetch(`/api/experiences/${exp.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !exp.featured }),
      });
      if (res.ok) {
        setExperiences((prev) =>
          prev.map((item) => (item.id === exp.id ? { ...item, featured: !item.featured } : item))
        );
        toast(`Milestone set to ${!exp.featured ? "Featured" : "Standard"}`, "success");
      } else {
        toast("Failed to update status", "error");
      }
    } catch {
      toast("Network error updating status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const currentList = [...experiences];
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, moved);

    const items = currentList.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    setExperiences(currentList.map((item, idx) => ({ ...item, order: idx })));

    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "experience", items }),
      });
      if (!res.ok) {
        toast("Failed to persist order", "error");
        fetchExperiences();
      }
    } catch {
      toast("Error updating order", "error");
      fetchExperiences();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/experiences/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast(`Milestone at "${deleteTarget.company}" deleted`, "success");
        setExperiences((prev) => prev.filter((exp) => exp.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast("Failed to delete milestone", "error");
      }
    } catch {
      toast("Network error deleting milestone", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Experience timeline...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Career &amp; Engineering Milestones</h2>
            <p className="text-xs font-mono text-muted">
              {experiences.length} career milestones and technical roles
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Milestone</span>
        </button>
      </div>

      {/* Experience Table */}
      <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/10 text-muted uppercase">
              <tr>
                <th className="py-4 px-6 w-16">Reorder</th>
                <th className="py-4 px-6">Period</th>
                <th className="py-4 px-6">Role &amp; Company</th>
                <th className="py-4 px-6">Stack</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {experiences.map((exp, index) => (
                <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Reorder Buttons */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(index, "up")}
                        disabled={index === 0}
                        className="p-1 rounded hover:bg-white/10 text-muted hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(index, "down")}
                        disabled={index === experiences.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-muted hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Period */}
                  <td className="py-4 px-6 text-accent font-bold">
                    {exp.period}
                  </td>

                  {/* Role & Company */}
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-bold text-foreground font-sans text-sm">
                        {exp.roleEn}
                      </div>
                      <p className="text-muted text-[11px]">
                        {exp.company} • {exp.location}
                      </p>
                    </div>
                  </td>

                  {/* Tech Stack Chips Count */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white">
                      {Array.isArray(exp.technologies) ? exp.technologies.length : 0} tags
                    </span>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleFeatured(exp)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        exp.featured
                          ? "bg-accent/15 border border-accent/40 text-accent"
                          : "bg-white/5 border border-white/10 text-muted hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${exp.featured ? "fill-accent" : ""}`} />
                      <span>{exp.featured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(exp)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                        title="Edit Milestone"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(exp)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 transition-colors"
                        title="Delete Milestone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {experiences.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No career milestones found. Click &quot;Add Milestone&quot; to publish your experience.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-surface z-10">
              <h3 className="font-display font-bold text-lg text-foreground">
                {editingExperience ? "Edit Career Milestone" : "Add Career Milestone"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Row 1: Period, Company, Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Period / Timeframe *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2023 — Present"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous AI Lab"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Row 2: Roles (EN & BN) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Role Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead AI Automation Architect"
                    value={roleEn}
                    onChange={(e) => setRoleEn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Role Title (Bengali) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. প্রধান এআই অটোমেশন আর্কিটেক্ট"
                    value={roleBn}
                    onChange={(e) => setRoleBn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Description (English) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={descriptionEn}
                    onChange={(e) => setDescriptionEn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Description (Bengali) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={descriptionBn}
                    onChange={(e) => setDescriptionBn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>

              {/* Technologies Tag Editor */}
              <div className="p-5 rounded-2xl bg-surface-raised border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">
                    Technologies &amp; Frameworks
                  </label>
                  <span className="text-[11px] font-mono text-muted">{technologies.length} tags</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {technologies.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-foreground"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(item)}
                        className="text-muted hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="e.g. Next.js, LangChain, NestJS"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTech()}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Featured Switch */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-accent focus:ring-accent bg-surface-raised"
                  />
                  <span className="text-xs font-mono text-foreground">
                    Featured milestone displayed in about timeline
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Milestone...</span>
                    </>
                  ) : (
                    <span>{editingExperience ? "Update Milestone" : "Publish Milestone"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Experience Milestone"
        message={`Are you sure you want to permanently remove the milestone for "${deleteTarget?.roleEn}" at "${deleteTarget?.company}"?`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
