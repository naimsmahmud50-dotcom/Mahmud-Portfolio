"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  X,
  Send,
  Eye,
  RefreshCw,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useToast } from "./ToastContext";

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  service: string;
  message: string;
  ipAddress: string | null;
  status: "unread" | "read" | "replied" | "archived";
  createdAt: string;
  updatedAt: string;
}

export default function MessagesInbox() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const fetchMessages = useCallback(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res.data)) {
          setMessages(res.data);
        }
      })
      .catch(() => toast("Failed to load messages", "error"))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => m.status === "unread").length;
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (filterStatus === "all") return messages;
    return messages.filter((m) => m.status === filterStatus);
  }, [messages, filterStatus]);

  const handleUpdateStatus = async (
    id: string,
    status: "unread" | "read" | "replied" | "archived"
  ) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status } : m))
        );
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage((prev) => (prev ? { ...prev, status } : null));
        }
        toast(`Inquiry status updated to ${status}`, "success");
      } else {
        toast("Failed to update inquiry status", "error");
      }
    } catch {
      toast("Network error updating status", "error");
    }
  };

  const handleOpenMessage = (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      handleUpdateStatus(msg.id, "read");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/messages/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast("Inquiry deleted permanently", "success");
        setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        if (selectedMessage && selectedMessage.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
      } else {
        toast("Failed to delete inquiry", "error");
      }
    } catch {
      toast("Network error deleting inquiry", "error");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-muted flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-accent" />
        <span>Loading Inbound Inquiries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent relative">
            <Mail className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-accent animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-foreground">Messages &amp; Inquiries</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-mono text-xs font-bold">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-muted">
              {messages.length} total client transmissions received
            </p>
          </div>
        </div>

        <button
          onClick={fetchMessages}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-accent text-xs font-mono text-muted hover:text-white flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { label: "All Messages", value: "all", count: messages.length },
          { label: "Unread", value: "unread", count: unreadCount },
          { label: "Read", value: "read", count: messages.filter((m) => m.status === "read").length },
          { label: "Replied", value: "replied", count: messages.filter((m) => m.status === "replied").length },
          { label: "Archived", value: "archived", count: messages.filter((m) => m.status === "archived").length },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilterStatus(tab.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-mono transition-colors flex items-center gap-1.5 ${
              filterStatus === tab.value
                ? "bg-accent text-accent-ink font-bold"
                : "bg-surface border border-white/10 text-muted hover:text-white"
            }`}
          >
            <span>{tab.label}</span>
            <span className="opacity-60 text-[10px]">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Messages Table */}
      <div className="rounded-3xl bg-surface border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/10 text-muted uppercase">
              <tr>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Sender &amp; Email</th>
                <th className="py-4 px-6">Requested Service</th>
                <th className="py-4 px-6">Message Preview</th>
                <th className="py-4 px-6">Received</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredMessages.map((msg) => {
                const isUnread = msg.status === "unread";
                return (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`cursor-pointer transition-colors group ${
                      isUnread
                        ? "bg-accent/[0.04] hover:bg-accent/[0.08]"
                        : "hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          msg.status === "unread"
                            ? "bg-accent/20 border border-accent/40 text-accent animate-pulse"
                            : msg.status === "replied"
                            ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                            : msg.status === "archived"
                            ? "bg-white/5 border border-white/10 text-muted"
                            : "bg-white/10 border border-white/20 text-foreground"
                        }`}
                      >
                        {msg.status}
                      </span>
                    </td>

                    {/* Sender Name & Email */}
                    <td className="py-4 px-6">
                      <div>
                        <div
                          className={`font-sans text-sm ${
                            isUnread ? "font-bold text-accent" : "font-semibold text-foreground"
                          }`}
                        >
                          {msg.name}
                        </div>
                        <p className="text-muted text-[11px] font-mono">{msg.email}</p>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white">
                        {msg.service || "General Inquiry"}
                      </span>
                    </td>

                    {/* Message Preview */}
                    <td className="py-4 px-6">
                      <p className="text-muted text-[11px] truncate max-w-xs font-sans">
                        {msg.message}
                      </p>
                    </td>

                    {/* Received Timestamp */}
                    <td className="py-4 px-6 text-muted text-[11px]">
                      {formatDate(msg.createdAt)}
                    </td>

                    {/* Actions */}
                    <td
                      className="py-4 px-6 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenMessage(msg)}
                          className="p-1.5 rounded-lg border border-white/10 hover:border-accent text-muted hover:text-accent transition-colors"
                          title="Read Message"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <a
                          href={`mailto:${msg.email}?subject=Re:%20${encodeURIComponent(
                            msg.service || "Portfolio Inquiry"
                          )}&body=${encodeURIComponent(
                            `Hi ${msg.name},\n\nThank you for reaching out via my portfolio.\n\nBest regards,\nMahmud Hasan`
                          )}`}
                          className="p-1.5 rounded-lg border border-white/10 hover:border-emerald-500/50 text-muted hover:text-emerald-400 transition-colors"
                          title="Reply via Email"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => setDeleteTarget(msg)}
                          className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-muted hover:text-red-400 transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredMessages.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted">
                    No inquiries found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-surface border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-surface z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
                  <MailOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-foreground">
                    Inquiry Details
                  </h3>
                  <p className="text-xs font-mono text-muted">
                    Received on {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 rounded-lg text-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-surface-raised border border-white/5">
              <div>
                <p className="text-[11px] font-mono text-muted uppercase">From</p>
                <p className="text-sm font-bold text-foreground font-sans mt-0.5">
                  {selectedMessage.name}
                </p>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-xs font-mono text-accent hover:underline mt-0.5 block"
                >
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <p className="text-[11px] font-mono text-muted uppercase">Service Requested</p>
                <p className="text-sm font-semibold text-foreground mt-0.5">
                  {selectedMessage.service || "General Inquiry"}
                </p>
                {selectedMessage.ipAddress && (
                  <p className="text-[11px] font-mono text-muted mt-0.5">
                    Origin IP: {selectedMessage.ipAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <p className="text-xs font-mono text-muted uppercase tracking-wider">
                Message Content
              </p>
              <div className="p-6 rounded-2xl bg-surface-raised border border-white/10 font-sans text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {selectedMessage.message}
              </div>
            </div>

            {/* Status Changer Actions */}
            <div className="p-5 rounded-2xl bg-surface-raised border border-white/5 space-y-3">
              <p className="text-xs font-mono text-muted uppercase tracking-wider">
                Update Status
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "unread")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    selectedMessage.status === "unread"
                      ? "bg-accent/20 border-accent text-accent font-bold"
                      : "bg-surface border-white/10 text-muted hover:text-white"
                  }`}
                >
                  Mark Unread
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "read")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    selectedMessage.status === "read"
                      ? "bg-white/20 border-white text-white font-bold"
                      : "bg-surface border-white/10 text-muted hover:text-white"
                  }`}
                >
                  Mark Read
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "replied")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    selectedMessage.status === "replied"
                      ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold"
                      : "bg-surface border-white/10 text-muted hover:text-white"
                  }`}
                >
                  Mark Replied
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, "archived")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                    selectedMessage.status === "archived"
                      ? "bg-white/10 border-white/30 text-white font-bold"
                      : "bg-surface border-white/10 text-muted hover:text-white"
                  }`}
                >
                  Archive
                </button>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteTarget(selectedMessage)}
                className="px-4 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-mono flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Inquiry</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-muted hover:text-white"
                >
                  Close
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re:%20${encodeURIComponent(
                    selectedMessage.service || "Portfolio Inquiry"
                  )}&body=${encodeURIComponent(
                    `Hi ${selectedMessage.name},\n\nThank you for reaching out via my portfolio.\n\nBest regards,\nMahmud Hasan`
                  )}`}
                  onClick={() => handleUpdateStatus(selectedMessage.id, "replied")}
                  className="px-5 py-2.5 rounded-xl bg-accent text-accent-ink font-mono font-bold text-xs uppercase tracking-wider hover:bg-accent-hover flex items-center gap-2 transition-transform active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Inbound Inquiry"
        message={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel={deleting ? "Deleting..." : "Delete Permanently"}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
