import type { FsTimestamp } from "@/types";

/** Safely format a Firestore Timestamp (or null) as a short date. */
export function formatDate(ts?: FsTimestamp | null): string {
  if (!ts) return "—";
  try {
    const d = ts.toDate();
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
}

export function timestampToMs(ts?: FsTimestamp | null): number | null {
  if (!ts) return null;
  try {
    return ts.toMillis();
  } catch {
    return null;
  }
}

export function formatNumber(n?: number | null): string {
  if (n == null) return "—";
  return n.toLocaleString("en-US");
}

/** Format USD cents as a dollar string. */
export function formatCents(cents?: number | null): string {
  if (cents == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export function formatPercent(value?: number | null): string {
  if (value == null) return "—";
  return `${(value * 100).toFixed(1)}%`;
}
