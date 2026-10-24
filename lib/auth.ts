import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "mahmud_admin_session";

/**
 * Generate cryptographically secure random hex string using standard Web Crypto API
 */
function generateRandomHex(byteCount = 32): string {
  const bytes = new Uint8Array(byteCount);
  crypto.getRandomValues(bytes);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

// Cryptographically secure ephemeral fallback: strictly avoid predictable static default strings
const rawSecret = process.env.ADMIN_SESSION_SECRET;
const SESSION_SECRET: string =
  rawSecret && rawSecret.trim().length >= 16
    ? rawSecret.trim()
    : (() => {
        if (process.env.NODE_ENV === "production") {
          console.warn(
            "[SECURITY NOTICE]: ADMIN_SESSION_SECRET is not configured or too short in environment. Generating an ephemeral cryptographic secret for this runtime instance."
          );
        }
        return generateRandomHex(32);
      })();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

// 7 days session duration
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Constant-time string equality check to mitigate timing side-channel attacks.
 * Native Edge Runtime and Node.js compatible without external runtime dependencies.
 */
function timingSafeEqualStrings(a: string, b: string): boolean {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const aLen = a.length;
  const bLen = b.length;
  let mismatch = aLen ^ bLen;
  for (let i = 0; i < aLen; i++) {
    const charB = i < bLen ? b.charCodeAt(i) : 0;
    mismatch |= a.charCodeAt(i) ^ charB;
  }
  return mismatch === 0;
}

/**
 * Import HMAC crypto key
 */
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Convert ArrayBuffer to Hex string
 */
function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

/**
 * Create a cryptographically signed session token
 */
export async function createAdminSessionToken(): Promise<string> {
  const payload = {
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const payloadStr = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadStr).toString("base64url");

  const key = await getCryptoKey();
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
  const signatureHex = bufferToHex(signatureBuffer);

  return `${payloadBase64}.${signatureHex}`;
}

/**
 * Verify session token validity and expiration
 */
export async function verifyAdminSessionToken(token: string | null | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [payloadBase64, providedSigHex] = parts;
  try {
    const key = await getCryptoKey();
    const enc = new TextEncoder();
    const expectedSigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(payloadBase64));
    const expectedSigHex = bufferToHex(expectedSigBuffer);

    // Constant-time signature verification
    if (!timingSafeEqualStrings(providedSigHex, expectedSigHex)) return false;

    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf-8");
    const payload = JSON.parse(payloadJson);

    if (payload.role !== "admin") return false;
    if (!payload.exp || Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}

/**
 * Check admin password from environment with timing-attack immunity
 */
export function verifyAdminPassword(passwordAttempt: string): boolean {
  if (!passwordAttempt || typeof passwordAttempt !== "string") return false;
  if (!ADMIN_PASSWORD || ADMIN_PASSWORD.trim() === "") return false;
  return timingSafeEqualStrings(passwordAttempt, ADMIN_PASSWORD);
}

/**
 * Verify whether an incoming Request is authenticated as admin
 */
export async function verifyAdmin(request?: Request): Promise<boolean> {
  // 1. Try reading cookie directly from incoming Request headers
  if (request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${ADMIN_COOKIE_NAME}=`));

    if (match) {
      const token = match.split("=")[1];
      const valid = await verifyAdminSessionToken(token);
      if (valid) return true;
    }

    // Also support Bearer Authorization header for programmatic API testing
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7).trim();
      const valid = await verifyAdminSessionToken(token);
      if (valid) return true;
    }
  }

  // 2. Fall back to next/headers cookies() store
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (token) {
      return await verifyAdminSessionToken(token);
    }
  } catch {
    // If called outside request context
  }

  return false;
}
