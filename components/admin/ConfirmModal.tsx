"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  isDestructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onCancel}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-surface border border-white/10 shadow-2xl z-10"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  isDestructive
                    ? "bg-red-500/15 border border-red-500/30 text-red-400"
                    : "bg-accent/15 border border-accent/30 text-accent"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-foreground">
                {title}
              </h3>
            </div>

            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-muted hover:text-foreground p-1 transition-colors disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-sans text-muted leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-full border border-white/10 text-xs font-mono text-muted hover:text-foreground hover:border-white/20 transition-colors disabled:opacity-40"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-semibold transition-all flex items-center gap-2 ${
                isDestructive
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                  : "bg-accent hover:opacity-90 text-accent-ink"
              } disabled:opacity-50`}
            >
              {isLoading ? "Processing..." : confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
