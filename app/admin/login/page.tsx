"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";
import Magnetic from "@/components/Magnetic";

function LoginForm() {
  const [passcode, setPasscode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("from") || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passcode }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        router.push(fromUrl);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Authentication failed. Invalid passkey.");
      }
    } catch {
      setErrorMsg("Network or server connection failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-surface border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent/10 rounded-full blur-[90px] pointer-events-none" />

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent">
          <Lock className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-foreground">
            Kirby-Grade Control Panel
          </h1>
          <p className="text-[11px] font-mono text-muted">
            Mahmud Hasan · Core Studio Dashboard
          </p>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-mono uppercase tracking-widest text-muted mb-2">
            Security Passcode
          </label>
          <input
            type="password"
            required
            autoFocus
            placeholder="Enter master passkey..."
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl bg-surface-raised border border-white/10 text-foreground text-sm focus:outline-none focus:border-accent transition-colors font-mono disabled:opacity-50"
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/30 text-danger text-xs font-mono flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="pt-2">
          <Magnetic strength={0.3} className="w-full">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-accent text-accent-ink font-semibold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Authorize &amp; Enter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </Magnetic>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-muted">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Server-Side HMAC Shield
        </span>
        <span>Authorized Personnel Only</span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-24">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-8 rounded-3xl bg-surface border border-white/10 text-center font-mono text-xs text-muted">
            Loading security gateway...
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
