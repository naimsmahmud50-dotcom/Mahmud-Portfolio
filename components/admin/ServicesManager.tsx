"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Wrench,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Star,
  Loader2,
  X,
  Code,
  Bot,
  Smartphone,
  Cloud,
  ShieldCheck,
  Layers,
  Cpu,
  Workflow,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastContext";

export interface ServiceItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  deliverables: string[];
  icon: string;
  featured: boolean;
  order: number;
}

const AVAILABLE_ICONS = [
  { name: "Bot", label: "AI Agent", icon: Bot },
  { name: "Code", label: "Web Code", icon: Code },
  { name: "Smartphone", label: "Mobile", icon: Smartphone },
  { name: "Cloud", label: "DevOps", icon: Cloud },
  { name: "ShieldCheck", label: "Security", icon: ShieldCheck },
  { name: "Layers", label: "Architecture", icon: Layers },
  { name: "Cpu", label: "Systems", icon: Cpu },
  { name: "Workflow", label: "Pipelines", icon: Workflow },
];

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form State
  const [titleEn, setTitleEn] = useState("");
  const [titleBn, setTitleBn] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionBn, setDescriptionBn] = useState("");
  const [icon, setIcon] = useState("Code");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [featured, setFeatured] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ServiceItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchServices = useCallback(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setServices(res.data);
        }
      })
      .catch(() => toast("Failed to load services", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const openCreateModal = () => {
    setEditingService(null);
    setTitleEn("");
    setTitleBn("");
    setDescriptionEn("");
    setDescriptionBn("");
    setIcon("Bot");
    setDeliverables(["End-to-End Implementation", "High-Availability Deployment"]);
    setDeliverableInput("");
    setFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (s: ServiceItem) => {
    setEditingService(s);
    setTitleEn(s.titleEn);
    setTitleBn(s.titleBn);
    setDescriptionEn(s.descriptionEn);
    setDescriptionBn(s.descriptionBn);
    setIcon(s.icon || "Code");
    setDeliverables(Array.isArray(s.deliverables) ? s.deliverables : []);
    setDeliverableInput("");
    setFeatured(s.featured);
    setModalOpen(true);
  };

  const handleAddDeliverable = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = deliverableInput.trim();
    if (!val) return;
    if (deliverables.includes(val)) {
      toast("Deliverable already added", "error");
      return;
    }
    setDeliverables([...deliverables, val]);
    setDeliverableInput("");
  };

  const handleRemoveDeliverable = (item: string) => {
    setDeliverables(deliverables.filter((d) => d !== item));
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleBn.trim()) {
      toast("English and Bengali titles are required", "error");
      return;
    }
    if (!descriptionEn.trim() || !descriptionBn.trim()) {
      toast("English and Bengali descriptions are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        titleEn: titleEn.trim(),
        titleBn: titleBn.trim(),
        descriptionEn: descriptionEn.trim(),
        descriptionBn: descriptionBn.trim(),
        icon,
        deliverables,
        featured,
        order: editingService ? editingService.order : services.length,
      };

      const url = editingService ? `/api/services/${editingService.id}` : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast(editingService ? "Service updated successfully" : "Service created successfully", "success");
        setModalOpen(false);
        fetchServices();
      } else {
        toast(data.error || "Failed to save service", "error");
      }
    } catch {
      toast("Network error saving service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (s: ServiceItem) => {
    try {
      const res = await fetch(`/api/services/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !s.featured }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((item) => (item.id === s.id ? { ...item, featured: !item.featured } : item))
        );
        toast(`Service set to ${!s.featured ? "Featured" : "Standard"}`, "success");
      } else {
        toast("Failed to update status", "error");
      }
    } catch {
      toast("Network error updating status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= services.length) return;

    const currentList = [...services];
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, moved);

    const items = currentList.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    setServices(currentList.map((item, idx) => ({ ...item, order: idx })));

    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "service", items }),
      });
      if (!res.ok) {
        toast("Failed to persist order", "error");
        fetchServices();
      }
    } catch {
      toast("Error updating order", "error");
      fetchServices();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/services/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast(`Service "${deleteTarget.titleEn}" deleted`, "success");
        setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast("Failed to delete service", "error");
      }
    } catch {
      toast("Network error deleting service", "error");
    } finally {
      setDeleting(false);
    }
  };

  const renderIcon = (iconName: string) => {
    const match = AVAILABLE_ICONS.find((i) => i.name === iconName) || AVAILABLE_ICONS[1];
    const Comp = match.icon;
    return <Comp className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Services catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Services &amp; Capabilities</h2>
            <p className="text-xs font-mono text-muted">
              {services.length} core engineering service offerings
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/10 text-muted uppercase">
              <tr>
                <th className="py-4 px-6 w-16">Reorder</th>
                <th className="py-4 px-6">Service Title</th>
                <th className="py-4 px-6">Bengali Title</th>
                <th className="py-4 px-6">Deliverables</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {services.map((s, index) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition-colors group">
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
                        disabled={index === services.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-muted hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Title & Icon */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-raised border border-white/10 flex items-center justify-center text-accent">
                        {renderIcon(s.icon)}
                      </div>
                      <div>
                        <div className="font-bold text-foreground font-sans text-sm">
                          {s.titleEn}
                        </div>
                        <p className="text-muted text-[11px] truncate max-w-xs">{s.descriptionEn}</p>
                      </div>
                    </div>
                  </td>

                  {/* Bengali Title */}
                  <td className="py-4 px-6 text-muted font-sans">
                    {s.titleBn}
                  </td>

                  {/* Deliverables Count */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white">
                      {Array.isArray(s.deliverables) ? s.deliverables.length : 0} items
                    </span>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleFeatured(s)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        s.featured
                          ? "bg-accent/15 border border-accent/40 text-accent"
                          : "bg-white/5 border border-white/10 text-muted hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${s.featured ? "fill-accent" : ""}`} />
                      <span>{s.featured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(s)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {services.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No services found. Click &quot;Add Service&quot; to define capabilities.
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
                {editingService ? "Edit Service Offering" : "Add Service Offering"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-5">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autonomous AI Agents"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Title (Bengali) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. স্বায়ত্তশাসিত এআই এজেন্ট"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
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

              {/* Icon Picker */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                  Service Icon
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {AVAILABLE_ICONS.map((opt) => {
                    const Comp = opt.icon;
                    const isSelected = icon === opt.name;
                    return (
                      <button
                        key={opt.name}
                        type="button"
                        onClick={() => setIcon(opt.name)}
                        className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                          isSelected
                            ? "bg-accent/15 border-accent text-accent"
                            : "bg-surface-raised border-white/10 text-muted hover:text-white"
                        }`}
                      >
                        <Comp className="w-5 h-5" />
                        <span className="text-[10px] font-mono">{opt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Deliverables Array */}
              <div className="p-5 rounded-2xl bg-surface-raised border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">
                    Key Deliverables / Scope
                  </label>
                  <span className="text-[11px] font-mono text-muted">{deliverables.length} deliverables</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {deliverables.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface border border-white/10 text-xs font-mono text-foreground"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveDeliverable(item)}
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
                    placeholder="e.g. LangChain & Tool Use Integrations"
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddDeliverable();
                      }
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-white/10 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDeliverable()}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono text-white"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Featured Toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 text-accent focus:ring-accent bg-surface-raised"
                  />
                  <span className="text-xs font-mono text-foreground">
                    Featured service on homepage cards
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
                      <span>Saving Service...</span>
                    </>
                  ) : (
                    <span>{editingService ? "Update Service" : "Create Service"}</span>
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
        title="Delete Service Offering"
        message={`Are you sure you want to permanently delete "${deleteTarget?.titleEn}"? This service and its deliverables will be removed.`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
