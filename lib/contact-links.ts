/**
 * Contact link normalization helpers.
 *
 * Ensures WhatsApp, Telegram, phone, and email hrefs are always
 * in the correct format regardless of how the admin stored them.
 */

/**
 * Strip everything except digits from a phone string.
 * If the number doesn't start with a country code, prepend "880" (Bangladesh).
 *
 * @example
 * normalizePhone("+880 1767-850859")  → "8801767850859"
 * normalizePhone("01767850859")       → "8801767850859"
 * normalizePhone("8801767850859")     → "8801767850859"
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  // If the number starts with "0" (local BD format), drop the leading 0 and add 880
  if (digits.startsWith("0")) return `880${digits.slice(1)}`;
  // If it already starts with 880, return as-is
  if (digits.startsWith("880")) return digits;
  // Otherwise return digits as-is (could be another country)
  return digits;
}

/**
 * Build a proper WhatsApp deep link.
 * Accepts any of:
 *   - A full URL: "https://wa.me/8801767850859"
 *   - A raw phone: "+880 1767-850859"  /  "01767850859"
 *
 * @param phoneOrUrl  The stored value from SiteSettings
 * @param prefillText Optional pre-filled message
 */
export function buildWhatsAppUrl(phoneOrUrl: string, prefillText?: string): string {
  let digits: string;

  if (phoneOrUrl.includes("wa.me/")) {
    // Extract the number from a URL like "https://wa.me/8801767850859?text=..."
    const afterWaMe = phoneOrUrl.split("wa.me/")[1]?.split(/[?#]/)[0] || "";
    digits = afterWaMe.replace(/\D/g, "");
  } else {
    digits = normalizePhone(phoneOrUrl);
  }

  let url = `https://wa.me/${digits}`;
  if (prefillText) {
    url += `?text=${encodeURIComponent(prefillText)}`;
  }
  return url;
}

/**
 * Build a proper Telegram deep link.
 * Accepts any of:
 *   - A full URL: "https://t.me/naimsmahmud50"  or  "https://t.me/+8801767850859"
 *   - A username: "naimsmahmud50"  or  "@naimsmahmud50"
 *
 * @param usernameOrUrl  The stored value from SiteSettings
 */
export function buildTelegramUrl(usernameOrUrl: string): string {
  if (usernameOrUrl.includes("t.me/")) {
    // Already a URL — strip any trailing slashes and return
    return usernameOrUrl.split("?")[0].replace(/\/+$/, "");
  }
  // Raw username — strip leading "@" if present
  const username = usernameOrUrl.replace(/^@/, "");
  return `https://t.me/${username}`;
}

/**
 * Build a proper tel: link.
 *
 * @example
 * buildTelUrl("+880 1767-850859")  → "tel:+8801767850859"
 * buildTelUrl("01767850859")       → "tel:+8801767850859"
 */
export function buildTelUrl(phone: string): string {
  const digits = normalizePhone(phone);
  return `tel:+${digits}`;
}

/**
 * Build a proper mailto: link.
 */
export function buildMailtoUrl(email: string): string {
  return `mailto:${email.trim()}`;
}
