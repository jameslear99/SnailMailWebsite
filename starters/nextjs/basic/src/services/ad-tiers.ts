import { collection, getDocs, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { DEFAULT_AD_TIERS, getDefaultAdTier } from "@/config/ad-tiers";
import type { AdTier, AdTierId } from "@/types";

/**
 * Ad-tier service. Prefers the `adTiers` Firestore collection (managed by the
 * future admin portal) and falls back to the centralized config defaults so the
 * app works before that collection is populated.
 */

export async function getAdTiers(): Promise<AdTier[]> {
  try {
    const snap = await getDocs(query(collection(getDb(), "adTiers"), where("active", "==", true)));
    if (!snap.empty) {
      const tiers = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdTier);
      return tiers.sort((a, b) => a.sortOrder - b.sortOrder);
    }
  } catch {
    // Firestore unavailable or rules block read — fall through to defaults.
  }
  return [...DEFAULT_AD_TIERS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function getAdTier(id: AdTierId): Promise<AdTier | undefined> {
  const tiers = await getAdTiers();
  return tiers.find((t) => t.id === id) ?? getDefaultAdTier(id);
}
