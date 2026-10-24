"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { useToast } from "./ToastContext";

interface ImageUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  helperText?: string;
}

export default function ImageUploadField({
  label,
  value,
  onChange,
  helperText = "PNG, JPG, WebP, SVG, AVIF up to 5MB",
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast("File size exceeds 5MB limit", "error");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success && data.url) {
        onChange(data.url);
        toast("Image uploaded successfully!", "success");
      } else {
        toast(data.error || "Image upload failed", "error");
      }
    } catch {
      toast("Upload failed due to network error", "error");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono uppercase tracking-wider text-muted">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-surface-raised border border-white/10">
        {/* Preview Thumbnail */}
        <div className="relative w-20 h-20 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            value.startsWith("http") || value.startsWith("/") ? (
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-[10px] font-mono text-muted p-1 text-center break-all">
                {value}
              </span>
            )
          ) : (
            <ImageIcon className="w-6 h-6 text-muted/40" />
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls & URL Input */}
        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. /images/projects/photo.jpg or upload..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-white/10 text-xs font-mono text-foreground focus:outline-none focus:border-accent"
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml,image/avif,image/gif"
              onChange={handleFileSelected}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-foreground flex items-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-accent" />
              <span>{isUploading ? "Uploading..." : "Upload"}</span>
            </button>

            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-2 rounded-xl bg-white/5 hover:bg-red-500/10 text-muted hover:text-red-400 transition-colors"
                title="Clear image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <p className="text-[11px] font-mono text-muted flex items-center gap-1.5">
            {value ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Image linked &amp; ready
              </span>
            ) : (
              <span>{helperText}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
