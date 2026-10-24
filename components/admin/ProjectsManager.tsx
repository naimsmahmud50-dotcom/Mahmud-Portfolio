"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FolderGit2,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  Eye,
  Star,
  Loader2,
  X,
} from "lucide-react";
import ImageUploadField from "./ImageUploadField";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastContext";

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  year: string;
  category: string;
  filterCategory: "all" | "web" | "android" | "automation";
  summary: string;
  problem: string;
  solution: string;
  result: string | null;
  stack: string[];
  highlights: string[];
  role: string;
  status: string;
  metrics: string;
  coverImage: string;
  mockupType: "browser" | "mobile" | "terminal";
  demoUrl: string | null;
  githubUrl: string | null;
  featured: boolean;
  order: number;
}

const FILTER_CATEGORIES = [
  { label: "All Works", value: "all" },
  { label: "AI & Automation", value: "automation" },
  { label: "Web Architecture", value: "web" },
  { label: "Mobile Apps", value: "android" },
];

export default function ProjectsManager() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [category, setCategory] = useState("Full-Stack Web & Automation");
  const [filterCategory, setFilterCategory] = useState<"all" | "web" | "android" | "automation">("web");
  const [summary, setSummary] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [result, setResult] = useState("");
  const [stack, setStack] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [role, setRole] = useState("Lead Architect");
  const [status, setStatus] = useState("Production");
  const [metrics, setMetrics] = useState("");
  const [coverImage, setCoverImage] = useState("/images/mahmud.jpg");
  const [mockupType, setMockupType] = useState<"browser" | "mobile" | "terminal">("browser");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [featured, setFeatured] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchProjects = useCallback(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setProjects(res.data);
        }
      })
      .catch(() => toast("Failed to load projects", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreateModal = () => {
    setEditingProject(null);
    setTitle("");
    setSlug("");
    setSubtitle("");
    setYear(new Date().getFullYear().toString());
    setCategory("Full-Stack Web & Automation");
    setFilterCategory("web");
    setSummary("");
    setProblem("");
    setSolution("");
    setResult("");
    setStack(["Next.js 14", "TypeScript", "Tailwind CSS"]);
    setStackInput("");
    setHighlights(["High performance", "Responsive UX"]);
    setHighlightInput("");
    setRole("Lead Architect");
    setStatus("Production");
    setMetrics("100% Lighthouse Score");
    setCoverImage("/images/mahmud.jpg");
    setMockupType("browser");
    setDemoUrl("");
    setGithubUrl("");
    setFeatured(true);
    setModalOpen(true);
  };

  const openEditModal = (p: ProjectItem) => {
    setEditingProject(p);
    setTitle(p.title);
    setSlug(p.slug);
    setSubtitle(p.subtitle);
    setYear(p.year);
    setCategory(p.category);
    setFilterCategory(p.filterCategory);
    setSummary(p.summary);
    setProblem(p.problem);
    setSolution(p.solution);
    setResult(p.result || "");
    setStack(Array.isArray(p.stack) ? p.stack : []);
    setStackInput("");
    setHighlights(Array.isArray(p.highlights) ? p.highlights : []);
    setHighlightInput("");
    setRole(p.role);
    setStatus(p.status);
    setMetrics(p.metrics);
    setCoverImage(p.coverImage);
    setMockupType(p.mockupType);
    setDemoUrl(p.demoUrl || "");
    setGithubUrl(p.githubUrl || "");
    setFeatured(p.featured);
    setModalOpen(true);
  };

  const handleAddStack = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = stackInput.trim();
    if (!val) return;
    if (stack.includes(val)) {
      toast("Stack item already added", "error");
      return;
    }
    setStack([...stack, val]);
    setStackInput("");
  };

  const handleRemoveStack = (item: string) => {
    setStack(stack.filter((s) => s !== item));
  };

  const handleAddHighlight = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = highlightInput.trim();
    if (!val) return;
    if (highlights.includes(val)) {
      toast("Highlight already in list", "error");
      return;
    }
    setHighlights([...highlights, val]);
    setHighlightInput("");
  };

  const handleRemoveHighlight = (item: string) => {
    setHighlights(highlights.filter((h) => h !== item));
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      toast("Title and slug are required", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim().toLowerCase(),
        subtitle: subtitle.trim(),
        year: year.trim(),
        category: category.trim(),
        filterCategory,
        summary: summary.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        result: result.trim() || null,
        stack,
        highlights,
        role: role.trim() || "Lead Architect",
        status: status.trim() || "Production",
        metrics: metrics.trim() || "Live in Production",
        coverImage: coverImage.trim(),
        mockupType,
        demoUrl: demoUrl.trim() || null,
        githubUrl: githubUrl.trim() || null,
        featured,
        order: editingProject ? editingProject.order : projects.length,
      };

      const url = editingProject ? `/api/projects/${editingProject.id}` : "/api/projects";
      const method = editingProject ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        toast(editingProject ? "Project updated successfully!" : "Project created successfully!", "success");
        setModalOpen(false);
        fetchProjects();
      } else {
        toast(data.error || "Failed to save project", "error");
      }
    } catch {
      toast("Network error saving project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (p: ProjectItem) => {
    try {
      const res = await fetch(`/api/projects/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !p.featured }),
      });
      if (res.ok) {
        setProjects((prev) =>
          prev.map((item) => (item.id === p.id ? { ...item, featured: !item.featured } : item))
        );
        toast(`Project ${!p.featured ? "marked as Featured" : "removed from Featured"}`, "success");
      } else {
        toast("Failed to toggle featured status", "error");
      }
    } catch {
      toast("Network error updating status", "error");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const currentList = [...projects];
    const [moved] = currentList.splice(index, 1);
    currentList.splice(targetIndex, 0, moved);

    const items = currentList.map((item, idx) => ({
      id: item.id,
      order: idx,
    }));

    setProjects(currentList.map((item, idx) => ({ ...item, order: idx })));

    try {
      const res = await fetch("/api/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "project", items }),
      });
      if (!res.ok) {
        toast("Failed to persist order", "error");
        fetchProjects();
      }
    } catch {
      toast("Error updating order", "error");
      fetchProjects();
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast(`Project "${deleteTarget.title}" deleted`, "success");
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast("Failed to delete project", "error");
      }
    } catch {
      toast("Network error deleting project", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Projects catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-foreground">Projects Catalog</h2>
            <p className="text-xs font-mono text-muted">
              {projects.length} case studies published in database
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/10 text-muted uppercase">
              <tr>
                <th className="py-4 px-6 w-16">Reorder</th>
                <th className="py-4 px-6">Preview &amp; Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Status / Year</th>
                <th className="py-4 px-6 text-center">Featured</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {projects.map((p, index) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
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
                        disabled={index === projects.length - 1}
                        className="p-1 rounded hover:bg-white/10 text-muted hover:text-foreground disabled:opacity-20 disabled:hover:bg-transparent"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Thumbnail & Title */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-surface-raised border border-white/10 flex-shrink-0">
                        {p.coverImage ? (
                          <Image
                            src={p.coverImage}
                            alt={p.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted">
                            <FolderGit2 className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-foreground font-sans text-sm flex items-center gap-2">
                          <span>{p.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-muted">
                            /{p.slug}
                          </span>
                        </div>
                        <p className="text-muted text-[11px] truncate max-w-xs">{p.subtitle}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white">
                      {p.category}
                    </span>
                  </td>

                  {/* Status & Year */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        {p.status}
                      </span>
                      <p className="text-muted text-[11px]">{p.year}</p>
                    </div>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                        p.featured
                          ? "bg-accent/15 border border-accent/40 text-accent"
                          : "bg-white/5 border border-white/10 text-muted hover:text-white"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${p.featured ? "fill-accent" : ""}`} />
                      <span>{p.featured ? "Featured" : "Hidden"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/work/${p.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                        title="Edit Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No projects found. Click &quot;Add Project&quot; to build your first case study.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Modal Editor (Full Drawer/Modal) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-surface z-10">
              <div>
                <h3 className="font-display font-bold text-xl text-foreground">
                  {editingProject ? `Edit Case Study: ${editingProject.title}` : "Create New Case Study"}
                </h3>
                <p className="text-xs font-mono text-muted">Complete portfolio project blueprint</p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6">
              {/* Row 1: Title, Slug, Year */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maijrun Madrasah OS"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingProject && !slug) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "")
                        );
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. maijrun-madrasah-os"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-mono text-accent focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Row 2: Subtitle & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Editorial Subtitle *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Enterprise Educational Infrastructure & Offline Cashflow Engine"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Key Metric Badge *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12,000+ Students, 0% Downtime"
                    value={metrics}
                    onChange={(e) => setMetrics(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Row 3: Category, Filter Category, Mockup Type, Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Category Label
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full-Stack Web Platform"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Filter Tab
                  </label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value as "all" | "web" | "android" | "automation")}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  >
                    {FILTER_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Mockup Frame
                  </label>
                  <select
                    value={mockupType}
                    onChange={(e) => setMockupType(e.target.value as "browser" | "mobile" | "terminal")}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  >
                    <option value="browser">Browser Window</option>
                    <option value="mobile">Mobile Frame</option>
                    <option value="terminal">Security Terminal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Release Year
                  </label>
                  <input
                    type="text"
                    required
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div className="p-5 rounded-2xl bg-surface-raised border border-white/5">
                <ImageUploadField
                  label="Cover Screenshot / Hero Image"
                  value={coverImage}
                  onChange={(url) => setCoverImage(url)}
                  helperText="High-resolution mockup, screenshot, or banner. Max 5MB."
                />
              </div>

              {/* Case Study Deep Narrative: Summary, Problem, Solution, Result */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Executive Summary *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                      The Architecture Problem / Bottleneck *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={problem}
                      onChange={(e) => setProblem(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                      Engineered Solution *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Business Result / Quantifiable Impact
                  </label>
                  <textarea
                    rows={2}
                    value={result}
                    onChange={(e) => setResult(e.target.value)}
                    placeholder="e.g. Reduced fee reconciliation latency from 3 days to sub-second transactions."
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>

              {/* Tag Editors: Tech Stack & Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tech Stack */}
                <div className="p-5 rounded-2xl bg-surface-raised border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">
                      Tech Stack Chips
                    </label>
                    <span className="text-[11px] font-mono text-muted">{stack.length} tags</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {stack.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-foreground"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStack(item)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. NestJS"
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddStack();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-surface border border-white/10 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddStack()}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Highlights */}
                <div className="p-5 rounded-2xl bg-surface-raised border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">
                      Key Highlights / Badges
                    </label>
                    <span className="text-[11px] font-mono text-muted">{highlights.length} items</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {highlights.map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-xs font-mono text-accent"
                      >
                        <span>{item}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(item)}
                          className="hover:text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="e.g. 100% Offline Cache"
                      value={highlightInput}
                      onChange={(e) => setHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg bg-surface border border-white/10 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddHighlight()}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono text-white"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Links & Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Production Demo URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-muted mb-2">
                    Source Code GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/org/repo"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-surface-raised border border-white/10 text-sm font-sans text-foreground focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Featured Switch */}
              <div className="p-4 rounded-xl bg-surface-raised border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-foreground font-bold">
                    Featured on Homepage &amp; Work Grid
                  </span>
                  <p className="text-[11px] font-mono text-muted">
                    When checked, this project appears prominently in the Dennis Snellenberg showcase.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-xs font-mono text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Case Study...</span>
                    </>
                  ) : (
                    <span>{editingProject ? "Update Case Study" : "Publish Case Study"}</span>
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
        title="Delete Project Case Study"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? All case study data and slug mapping will be deleted.`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
