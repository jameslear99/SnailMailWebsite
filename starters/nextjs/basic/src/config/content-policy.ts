/**
 * Configurable content policy. Snail Mail Social is a family-friendly platform
 * that may include minors, so all ad creative must be family-friendly.
 *
 * These categories are intentionally data-driven so the policy can evolve and
 * be surfaced consistently across the wizard, review, and (future) admin tools.
 */

export type ContentPolicyCategory = {
  id: string;
  label: string;
  description: string;
};

export const BLOCKED_CONTENT_CATEGORIES: ContentPolicyCategory[] = [
  { id: "adult", label: "Adult content", description: "Sexual or suggestive content." },
  { id: "explicit", label: "Explicit content", description: "Graphic violence or gore." },
  { id: "alcohol", label: "Alcohol", description: "Promotion or sale of alcoholic beverages." },
  { id: "tobacco", label: "Tobacco & nicotine", description: "Cigarettes, vaping, and nicotine products." },
  { id: "gambling", label: "Gambling", description: "Casinos, betting, lotteries, and games of chance." },
  { id: "weapons", label: "Weapons", description: "Firearms, ammunition, and related accessories." },
  { id: "drugs", label: "Drugs", description: "Illegal drugs and related paraphernalia." },
  {
    id: "deceptive_financial",
    label: "Deceptive financial products",
    description: "Predatory loans, get-rich-quick schemes, and misleading offers.",
  },
  {
    id: "political",
    label: "Political / inflammatory",
    description: "Overtly political or inflammatory content.",
  },
  {
    id: "health_claims",
    label: "Misleading health claims",
    description: "Unsubstantiated health or weight-loss claims.",
  },
  {
    id: "not_family_friendly",
    label: "Not family-friendly",
    description: "Anything inappropriate for a platform that may include minors.",
  },
];

export const CONTENT_POLICY_SUMMARY =
  "All ads must be family-friendly. Snail Mail Social may be received by minors, so creative cannot contain adult, explicit, alcohol, tobacco, gambling, weapons, drug, deceptive financial, overtly political, or misleading health content. Every campaign is manually reviewed before printing.";
