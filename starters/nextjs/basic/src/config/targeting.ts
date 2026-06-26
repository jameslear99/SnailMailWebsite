/**
 * Targeting constants + guardrails. Privacy-first: advertisers never see
 * individual users, only aggregate estimates. These values are centralized so
 * guardrails can be tuned in one place.
 */

/** Minimum estimated audience size required before a campaign can run. */
export const MINIMUM_AUDIENCE_THRESHOLD = 500;

/**
 * Advertisers may not target users under this age as a specific segment.
 * Minors can still receive family-friendly ads, but cannot be a targeted
 * audience segment.
 */
export const MINIMUM_TARGETABLE_AGE = 18;
export const MAXIMUM_TARGETABLE_AGE = 100;

export const GENDER_OPTIONS = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
  { id: "nonbinary", label: "Non-binary" },
  { id: "all", label: "All genders" },
] as const;

/**
 * Interest categories users select in the main app. Audience targeting maps
 * to these. Kept centralized so the app + portal stay in sync.
 */
export const INTEREST_OPTIONS = [
  "Food & Dining",
  "Shopping & Retail",
  "Travel",
  "Fitness & Wellness",
  "Home & Garden",
  "Technology",
  "Arts & Culture",
  "Sports",
  "Family & Parenting",
  "Pets",
  "Automotive",
  "Beauty & Personal Care",
  "Local Events",
  "Outdoors",
  "Gaming",
] as const;

/** Radius options (miles) for ZIP-centered radius targeting. */
export const RADIUS_OPTIONS_MILES = [5, 10, 25, 50, 100] as const;
