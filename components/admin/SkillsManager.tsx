"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Cpu,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Star,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "./ToastContext";
import ConfirmModal from "./ConfirmModal";

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: string | null;
  featured: boolean;
  order: number;
}

const CATEGORIES = [
  "AI & Automation",
  "Web Architecture",
  "Mobile Engineering",
  "Cloud & DevOps",
  "Core Tools",
];

export default function SkillsManager() {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState(CATEGORIES[0]);
  const [formLevel, setFormLevel] = useState("Expert");
  const [formFeatured, setFormFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SkillItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchSkills = useCallback(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setSkills(res.data);
        }
      })
      .catch(() => toast("Failed to load skills", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const filteredSkills = useMemo(() => {
    if (selectedCategory === "all") return skills;
    return skills.filter((s) => s.category === selectedCategory);
  }, [skills, selectedCategory]);

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormName("");
    setFormCategory(selectedCategory !== "all" ? selectedCategory : CATEGORIES[0]);
    setFormLevel("Expert");
    setFormFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (skill: SkillItem) => {
    setEditingSkill(skill);
    setFormName(skill.name);
    setFormCategory(skill.category);
    setFormLevel(skill.level || "Expert");
    setFormFeatured(skill.featured);
    setModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast("Skill name is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formName.trim(),
        category: formCategory,
        level: formLevel.trim() || "Expert",
        featured: formFeatured,
        order: editingSkill ? editingSkill.order : skills.length,
      };

      const url = editingSkill ? `/api/skills/${editingSkill.id}` : "/api/skills";
      const method = editingSkill ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast(editingSkill ? "Skill updated successfully" : "Skill created successfully", "success");
        setModalOpen(false);
        fetchSkills();
      } else {
        toast(data.error || "Failed to save skill", "error");
      }
    } catch {
      toast("Network error saving skill", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (skill: SkillItem) => {
    try {
      const res = await fetch(`/api/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !skill.featured }),
      });
      if (res.ok) {
        setSkills((prev) =>
          prev.map((s) => (s.id === skill.id ? { ...s, featured: !s.featured } : s))
        );
        toast(`Skill set to ${!skill.featured ? "Featured" : "Standard"}`, "success");
      } else {
        toast("Failed to toggle skill featured status", "error");
      }
    } catch {
      toast("Network error toggling featured status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredSkills.length) return;

    // Build reordered list
    const currentList = [...filteredSkills];
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, moved);

    // Map new orders
    const items = currentList.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    // Optimistic UI update
    setSkills((prev) => {
      const map = new Map(items.map((i) => [i.id, i.order]));
      return [...prev].map((s) => (map.has(s.id) ? { ...s, order: map.get(s.id)! } : s)).sort((a, b) => a.order - b.order);
    });

    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "skill", items }),
      });
      if (!res.ok) {
        toast("Failed to persist order", "error");
        fetchSkills();
      }
    } catch {
      toast("Error updating order", "error");
      fetchSkills();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/skills/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast(`Skill "${deleteTarget.name}" deleted`, "success");
        setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast("Failed to delete skill", "error");
      }
    } catch {
      toast("Network error deleting skill", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Skills catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Skills Catalog</h2>
            <p className="text-xs font-mono text-muted">
              {skills.length} total technical capabilities across {CATEGORIES.length} domains
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1.5 ${
            selectedCategory === "all"
              ? "bg-accent text-accent-ink font-bold"
              : "bg-surface border border-white/10 text-muted hover:text-white"
          }`}
        >
          <span>All ({skills.length})</span>
        </button>
        {CATEGORIES.map((cat) => {
          const count = skills.filter((s) => s.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? "bg-accent text-accent-ink font-bold"
                  : "bg-surface border border-white/10 text-muted hover:text-white"
              }`}
            >
              <span>{cat}</span>
              <span className="opacity-60 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Skills Table / List */}
      <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/10 text-muted uppercase">
              <tr>
                <th className="py-4 px-6 w-16">Reorder</th>
                <th className="py-4 px-6">Skill Name</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Proficiency</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSkills.map((skill, index) => (
                <tr key={skill.id} className="hover:bg-white/[0.02] transition-colors group">
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
                        disabled={index === filteredSkills.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-muted hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Skill Name */}
                  <td className="py-4 px-6 font-bold text-foreground font-sans text-sm">
                    {skill.name}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-muted">
                      {skill.category}
                    </span>
                  </td>

                  {/* Proficiency Level */}
                  <td className="py-4 px-6 text-muted">
                    {skill.level || "Expert"}
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleFeatured(skill)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        skill.featured
                          ? "bg-accent/15 border border-accent/40 text-accent"
                          : "bg-white/5 border border-white/10 text-muted hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${skill.featured ? "fill-accent" : ""}`} />
                      <span>{skill.featured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                        title="Edit skill"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(skill)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 transition-colors"
                        title="Delete skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSkills.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No skills found in this category. Click &quot;Add Skill&quot; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="font-display font-bold text-lg text-foreground">
                {editingSkill ? "Edit Skill" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-muted hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Skill / Technology Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js 14 App Router"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Proficiency Level
                </label>
                <input
                  type="text"
                  placeholder="Expert / Production / Advanced"
                  value={formLevel}
                  onChange={(e) => setFormLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-accent focus:ring-accent bg-surface-raised"
                  />
                  <span className="text-xs font-mono text-foreground">
                    Mark as Featured (highlighted badge on portfolio)
                  </span>
                </label>
              </div>

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
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingSkill ? "Update Skill" : "Create Skill"}</span>
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
        title="Delete Skill"
        message={`Are you sure you want to permanently delete "${deleteTarget?.name}"? This action will remove it from the skills catalog immediately.`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
