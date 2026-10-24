import { NextResponse } from "next/server";
import {
  verifyAdminPassword,
  createAdminSessionToken,
  ADMIN_COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// IP-based sliding window rate limiter (max 5 failed attempts per 15 minutes)
const failedAttemptsMap = new Map<string, number[]>();
const FAILED_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempts = (failedAttemptsMap.get(ip) || []).filter(
    (t) => now - t < FAILED_WINDOW_MS
  );
  failedAttemptsMap.set(ip, attempts);
  return attempts.length >= MAX_FAILED_ATTEMPTS;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const attempts = (failedAttemptsMap.get(ip) || []).filter(
    (t) => now - t < FAILED_WINDOW_MS
  );
  attempts.push(now);
  failedAttemptsMap.set(ip, attempts);
}

function clearFailedAttempts(ip: string) {
  failedAttemptsMap.delete(ip);
}

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown-ip";

    if (isIpRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many failed authentication attempts. Access temporarily locked for 15 minutes.",
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 }
      );
    }

    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      recordFailedAttempt(ip);
      // Progressive delay to thwart timing attacks and parallel brute-forcing
      await new Promise((res) => setTimeout(res, 800));
      return NextResponse.json(
        { success: false, error: "Invalid master passkey" },
        { status: 401 }
      );
    }

    // Reset failed counter upon successful passkey entry
    clearFailedAttempts(ip);

    const token = await createAdminSessionToken();

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[Admin Login Error]:", error);
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}
