"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MessageSquareQuote,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Star,
  Loader2,
  X,
  User,
} from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastContext";

export interface TestimonialItem {
  id: string;
  author: string;
  role: string;
  company: string;
  quoteEn: string;
  quoteBn: string;
  avatarUrl: string | null;
  featured: boolean;
  order: number;
}

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialItem | null>(null);

  // Form State
  const [author, setAuthor] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [quoteEn, setQuoteEn] = useState("");
  const [quoteBn, setQuoteBn] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [featured, setFeatured] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TestimonialItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchTestimonials = useCallback(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setTestimonials(res.data);
        }
      })
      .catch(() => toast("Failed to load testimonials", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openCreateModal = () => {
    setEditingTestimonial(null);
    setAuthor("");
    setRole("");
    setCompany("");
    setQuoteEn("");
    setQuoteBn("");
    setAvatarUrl("/images/mahmud.jpg");
    setFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (t: TestimonialItem) => {
    setEditingTestimonial(t);
    setAuthor(t.author);
    setRole(t.role);
    setCompany(t.company);
    setQuoteEn(t.quoteEn);
    setQuoteBn(t.quoteBn);
    setAvatarUrl(t.avatarUrl || "");
    setFeatured(t.featured);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !company.trim()) {
      toast("Author and company are required", "error");
      return;
    }
    if (!quoteEn.trim() || !quoteBn.trim()) {
      toast("Both English and Bengali quotes are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        author: author.trim(),
        role: role.trim(),
        company: company.trim(),
        quoteEn: quoteEn.trim(),
        quoteBn: quoteBn.trim(),
        avatarUrl: avatarUrl.trim() || null,
        featured,
        order: editingTestimonial ? editingTestimonial.order : testimonials.length,
      };

      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : "/api/testimonials";
      const method = editingTestimonial ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast(editingTestimonial ? "Testimonial updated" : "Testimonial created", "success");
        setModalOpen(false);
        fetchTestimonials();
      } else {
        toast(data.error || "Failed to save testimonial", "error");
      }
    } catch {
      toast("Network error saving testimonial", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (t: TestimonialItem) => {
    try {
      const res = await fetch(`/api/testimonials/${t.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !t.featured }),
      });
      if (res.ok) {
        setTestimonials((prev) =>
          prev.map((item) => (item.id === t.id ? { ...item, featured: !item.featured } : item))
        );
        toast(`Testimonial set to ${!t.featured ? "Featured" : "Standard"}`, "success");
      } else {
        toast("Failed to update status", "error");
      }
    } catch {
      toast("Network error updating status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const currentList = [...testimonials];
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, moved);

    const items = currentList.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    setTestimonials(currentList.map((item, idx) => ({ ...item, order: idx })));

    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "testimonial", items }),
      });
      if (!res.ok) {
        toast("Failed to persist order", "error");
        fetchTestimonials();
      }
    } catch {
      toast("Error updating order", "error");
      fetchTestimonials();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/testimonials/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast(`Testimonial from "${deleteTarget.author}" deleted`, "success");
        setTestimonials((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast("Failed to delete testimonial", "error");
      }
    } catch {
      toast("Network error deleting testimonial", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Testimonials...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Client Testimonials</h2>
            <p className="text-xs font-mono text-muted">
              {testimonials.length} client endorsements &amp; executive references
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Endorsement</span>
        </button>
      </div>

      {/* Testimonials Table */}
      <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/10 text-muted uppercase">
              <tr>
                <th className="py-4 px-6 w-16">Reorder</th>
                <th className="py-4 px-6">Author &amp; Company</th>
                <th className="py-4 px-6">Quote (English)</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {testimonials.map((t, index) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors group">
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
                        disabled={index === testimonials.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-muted hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Author & Photo */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-surface-raised border border-white/10 flex-shrink-0">
                        {t.avatarUrl ? (
                          <Image
                            src={t.avatarUrl}
                            alt={t.author}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted">
                            <User className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground font-sans text-sm">
                          {t.author}
                        </div>
                        <p className="text-muted text-[11px]">
                          {t.role} • {t.company}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Quote Snippet */}
                  <td className="py-4 px-6">
                    <p className="text-muted text-[11px] truncate max-w-md italic font-sans">
                      &quot;{t.quoteEn}&quot;
                    </p>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleFeatured(t)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        t.featured
                          ? "bg-accent/15 border border-accent/40 text-accent"
                          : "bg-white/5 border border-white/10 text-muted hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${t.featured ? "fill-accent" : ""}`} />
                      <span>{t.featured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(t)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                        title="Edit Testimonial"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(t)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {testimonials.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-muted">
                    No client testimonials added yet. Click &quot;Add Endorsement&quot; to publish one.
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
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-surface z-10">
              <h3 className="font-display font-bold text-lg text-foreground">
                {editingTestimonial ? "Edit Client Endorsement" : "Add Client Endorsement"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Row 1: Author, Role, Company */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Kazi Tariq"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Director"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maijrun Complex"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Avatar Upload */}
              <ImageUploadField
                label="Author Headshot (Avatar)"
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
                helperText="Square photo or transparent avatar. Max 5MB."
              />

              {/* Quotes */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Quote (English) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={quoteEn}
                    onChange={(e) => setQuoteEn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Quote (Bengali) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={quoteBn}
                    onChange={(e) => setQuoteBn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                  />
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
                    Featured testimonial on homepage slider
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
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingTestimonial ? "Update Endorsement" : "Publish Endorsement"}</span>
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
        title="Delete Testimonial"
        message={`Are you sure you want to permanently remove the endorsement from "${deleteTarget?.author}"?`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
