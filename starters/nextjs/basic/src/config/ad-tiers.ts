import type { AdTier, AdTierId } from "@/types";

/**
 * Centralized ad-tier + pricing config.
 *
 * IMPORTANT: This is the single source of truth for pricing in the codebase.
 * Pricing must NEVER be hardcoded elsewhere. At runtime the app should prefer
 * the `adTiers` Firestore collection (managed by the future admin portal) and
 * fall back to these defaults via `getAdTiers()` in the ad-tier service.
 *
 * Pricing model: cost per printed ad, varying only by ad tier. No minimum
 * spend and no minimum quantity for now.
 *
 * All prices are in USD cents to avoid floating-point money bugs.
 */

export const CURRENCY = "usd" as const;

/** Convert cents -> formatted dollars string. */
export function formatPrice(cents: number, opts?: { perAd?: boolean }): string {
  const dollars = cents / 100;
  const str = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: dollars % 1 === 0 ? 2 : 2,
    maximumFractionDigits: 2,
  }).format(dollars);
  return opts?.perAd ? `${str}/ad` : str;
}

export const DEFAULT_AD_TIERS: AdTier[] = [
  {
    id: "quarter_page",
    name: "Quarter Page",
    description:
      "A compact placement — up to eight quarter-page ads share a single bundle page. Ideal for offers, coupons, and local awareness.",
    pricePerPrintedAd: 39, // $0.39 per printed ad
    dimensions: { widthPx: 1050, heightPx: 1350, dpi: 300 },
    printSpecs: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
      allowedFileTypes: ["png"],
      maxFileSizeMb: 25,
    },
    active: true,
    sortOrder: 1,
  },
  {
    id: "half_page",
    name: "Half Page",
    description:
      "A prominent half-page placement with room for stronger creative and a clear call to action.",
    pricePerPrintedAd: 69, // $0.69 per printed ad
    dimensions: { widthPx: 2100, heightPx: 1350, dpi: 300 },
    printSpecs: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
      allowedFileTypes: ["png"],
      maxFileSizeMb: 40,
    },
    active: true,
    sortOrder: 2,
  },
  {
    id: "full_page_one_side",
    name: "Full Page One Side",
    description:
      "A full single-sided page dedicated entirely to your brand. Maximum impact in the bundle.",
    pricePerPrintedAd: 119, // $1.19 per printed ad
    dimensions: { widthPx: 2550, heightPx: 3300, dpi: 300 },
    printSpecs: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
      allowedFileTypes: ["png"],
      maxFileSizeMb: 60,
    },
    active: true,
    sortOrder: 3,
  },
  {
    id: "full_page_front_and_back",
    name: "Full Page Front and Back",
    description:
      "Both sides of a full page — tell a complete story with front-and-back creative.",
    pricePerPrintedAd: 199, // $1.99 per printed ad
    dimensions: { widthPx: 2550, heightPx: 3300, dpi: 300 },
    printSpecs: {
      bleedInches: 0.125,
      safeMarginInches: 0.25,
      allowedFileTypes: ["png"],
      maxFileSizeMb: 120,
    },
    active: true,
    sortOrder: 4,
  },
];

export const AD_TIER_IDS: AdTierId[] = DEFAULT_AD_TIERS.map((t) => t.id);

export function getDefaultAdTier(id: AdTierId): AdTier | undefined {
  return DEFAULT_AD_TIERS.find((t) => t.id === id);
}

/** Bundle rule: each mailed bundle can include up to 4 ad pages. */
export const MAX_AD_PAGES_PER_BUNDLE = 4;
/** A single ad page can hold up to 8 quarter-page ads. */
export const QUARTER_PAGE_ADS_PER_PAGE = 8;
