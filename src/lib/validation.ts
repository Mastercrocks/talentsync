// Basic validation utilities for user-entered data

// Simplified RFC 5322-ish email regex good enough for UI validation
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export function validateEmail(email: string | undefined | null): boolean {
  const e = (email ?? "").trim();
  if (!e) return false;
  return EMAIL_RE.test(e);
}

// Normalize to digits with optional leading +, remove formatting characters
export function normalizePhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  const raw = phone.toString().trim();
  if (!raw) return undefined;
  // Keep leading +, strip all non-digits otherwise
  const hasPlus = raw.startsWith("+");
  const digits = raw.replace(/[^0-9]/g, "");
  const normalized = (hasPlus ? "+" : "") + digits;
  return normalized || undefined;
}

// Very loose phone validity: allow E.164 up to 15 digits, or national 10-14 digits
export function validatePhone(phone: string | undefined | null): boolean {
  if (!phone) return true; // empty is acceptable
  const p = normalizePhone(phone);
  if (!p) return true; // treated as empty
  // E.164 max length 15 digits (plus optional +)
  const digits = p.startsWith("+") ? p.slice(1) : p;
  if (digits.length < 7 || digits.length > 15) return false;
  return /^(\+)?\d{7,15}$/.test(p);
}

export function trimString(s?: string | null): string | undefined {
  const t = (s ?? "").trim();
  return t || undefined;
}
