"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FolderGit2,
  User,
  Mail,
  Sun,
  Moon,
  Languages,
  FileDown,
  Terminal,
  X,
  Copy,
  Check,
  BookOpen,
  ArrowRight,
  Layers,
} from "lucide-react";
import { useTheme } from "./ThemeToggle";
import { useI18n } from "@/lib/i18n";
import { usePageTransition } from "@/context/TransitionContext";
import { defaultProjects as projects } from "@/lib/data";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dynamicProjects, setDynamicProjects] = useState(projects);

  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLang } = useI18n();
  const { navigate } = usePageTransition();
  const listRef = useRef<HTMLDivElement>(null);

  // Sync projects from database API
  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((res) => {
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setDynamicProjects(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard shortcut listener: K, Cmd+K, Ctrl+K, Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Allow Cmd+K or Ctrl+K anywhere; Allow bare "k" only when not inside an input
      if (
        (e.key === "k" || e.key === "K") &&
        (e.metaKey || e.ctrlKey || !isInput)
      ) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle Copy Email action
  const handleCopyEmail = () => {
    navigator.clipboard.writeText("mahmudhasan.infodev@gmail.com");
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setIsOpen(false);
    }, 1500);
  };

  // Compile all commands: Navigation, Projects, Actions, Preferences
  const pageCommands = [
    {
      id: "page-home",
      label: "Home — Introduction & Overview",
      category: "Pages",
      icon: Layers,
      action: () => navigate("/"),
    },
    {
      id: "page-work",
      label: "Selected Work — Project Portfolio",
      category: "Pages",
      icon: FolderGit2,
      action: () => navigate("/work"),
    },
    {
      id: "page-about",
      label: "About Mahmud — Biography & Arsenal",
      category: "Pages",
      icon: User,
      action: () => navigate("/about"),
    },
    {
      id: "page-contact",
      label: "Contact — Initiate Collaboration",
      category: "Pages",
      icon: Mail,
      action: () => navigate("/contact"),
    },
    {
      id: "page-notes",
      label: "Engineering Notes — Field Technical Essays",
      category: "Pages",
      icon: BookOpen,
      action: () => navigate("/notes"),
    },
  ];

  const projectCommands = dynamicProjects.map((p) => ({
    id: `project-${p.slug}`,
    label: `${p.title} — ${(p.filterCategory || p.category || "").toUpperCase()} (${p.year})`,
    category: "Projects",
    icon: FolderGit2,
    action: () => navigate(`/work/${p.slug}`),
  }));

  const actionCommands = [
    {
      id: "act-copy-email",
      label: copied ? "Copied: mahmudhasan.infodev@gmail.com" : "Copy Email Address (mahmudhasan.infodev@gmail.com)",
      category: "Actions",
      icon: copied ? Check : Copy,
      action: handleCopyEmail,
    },
    {
      id: "act-download-cv",
      label: "Download Curriculum Vitae (PDF)",
      category: "Actions",
      icon: FileDown,
      action: () => window.open("/cv.pdf", "_blank"),
    },
    {
      id: "pref-theme",
      label: `Switch Theme to ${theme === "dark" ? "Light" : "Dark"} Mode`,
      category: "Preferences",
      icon: theme === "dark" ? Sun : Moon,
      action: () => toggleTheme(),
    },
    {
      id: "pref-lang",
      label: `Switch Language to ${lang === "en" ? "বাংলা (Bengali)" : "English"}`,
      category: "Preferences",
      icon: Languages,
      action: () => toggleLang(),
    },
  ];

  const allCommands = [...pageCommands, ...projectCommands, ...actionCommands];

  const filteredCommands = allCommands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  // Arrow key navigation inside palette
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredCommands.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCommands.length - 1
      );
    } else if (e.key === "Enter" && filteredCommands[selectedIndex]) {
      e.preventDefault();
      filteredCommands[selectedIndex].action();
      if (!filteredCommands[selectedIndex].id.startsWith("act-copy")) {
        setIsOpen(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette Navigator"
          className="fixed inset-0 z-[99999] flex items-start justify-center p-4 sm:p-6 md:p-20 pt-16 sm:pt-24 select-none"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-bg/80 backdrop-blur-md"
          />

          {/* Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -16 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-full max-w-2xl rounded-3xl border border-line bg-surface text-text shadow-2xl overflow-hidden flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-line">
              <Search className="w-5 h-5 text-accent shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handlePaletteKeyDown}
                placeholder="Jump to page, project, or execute action... (ESC to close)"
                autoFocus
                className="w-full bg-transparent text-base sm:text-lg focus:outline-none placeholder:text-muted font-mono"
              />
              <button
                onClick={() => setIsOpen(false)}
                type="button"
                aria-label="Close command palette"
                className="p-1.5 rounded-full hover:bg-surface-raised text-muted hover:text-text transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div
              ref={listRef}
              className="overflow-y-auto p-3 space-y-1.5 flex-1 divide-y divide-line/20"
            >
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-sm font-mono text-muted">
                  No matching command or project found.
                </div>
              ) : (
                filteredCommands.map((item, idx) => {
                  const Icon = item.icon;
                  const isSelected = selectedIndex === idx;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        item.action();
                        if (!item.id.startsWith("act-copy")) {
                          setIsOpen(false);
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-accent text-accent-ink font-semibold shadow-md shadow-accent/15"
                          : "hover:bg-surface-raised text-text"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-accent-ink/15 text-accent-ink"
                              : "bg-bg text-muted border border-line"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm truncate font-medium">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-accent-ink/20 text-accent-ink"
                              : "bg-bg text-muted border border-line"
                          }`}
                        >
                          {item.category}
                        </span>
                        {isSelected && (
                          <ArrowRight className="w-3.5 h-3.5 text-accent-ink" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-line text-xs font-mono text-muted bg-surface-raised">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-accent" />
                <span>Command Navigator</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
