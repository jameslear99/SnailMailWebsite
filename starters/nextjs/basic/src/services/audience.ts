import type { AudienceEstimate, CampaignTargeting } from "@/types";
import {
  MINIMUM_AUDIENCE_THRESHOLD,
  MINIMUM_TARGETABLE_AGE,
} from "@/config/targeting";

/**
 * Audience estimation service.
 *
 * PLACEHOLDER LOGIC: The live audience data will come from user profiles in the
 * main Snail Mail Social app. Until that data pipeline exists, this returns a
 * deterministic estimate derived from the selected targeting so the UX and
 * guardrails are fully wired. The function signature + return shape are stable,
 * so the internals can later be swapped to query Firestore user profiles (or a
 * Cloud Function / aggregation) without changing any callers.
 *
 * Privacy: this NEVER returns or exposes individual users — only an aggregate
 * estimate, a threshold flag, and human-readable warnings.
 */

// Mock total addressable Snail Mail Social audience (will become a live count).
const MOCK_TOTAL_AUDIENCE = 1_250_000;

// Rough share of users who have opted OUT of personalized advertising.
const OPT_OUT_RATE = 0.12;

function deterministicJitter(seed: string): number {
  // Stable 0.9–1.1 multiplier so repeated estimates for the same targeting match.
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return 0.9 + (hash % 200) / 1000;
}

export function estimateAudience(targeting: CampaignTargeting): AudienceEstimate {
  const warnings: string[] = [];
  let reach = MOCK_TOTAL_AUDIENCE;

  // --- Location ---
  const loc = targeting.locations;
  if (loc) {
    const cityCount = loc.cities?.length ?? 0;
    const zipCount = loc.zipCodes?.length ?? 0;
    const radiusTargets = loc.radiusTargets ?? [];

    if (cityCount || zipCount || radiusTargets.length) {
      // Each location unit captures a slice of the total audience.
      let locationReach = 0;
      locationReach += cityCount * 28_000;
      locationReach += zipCount * 6_500;
      for (const r of radiusTargets) {
        // Larger radius -> more people, with diminishing returns.
        locationReach += Math.round(1200 * Math.sqrt(r.radiusMiles) + r.radiusMiles * 250);
        if (r.radiusMiles <= 5) {
          warnings.push(
            `Radius target around ${r.centerZipCode} (${r.radiusMiles} mi) has limited coverage.`,
          );
        }
      }
      reach = Math.min(reach, locationReach || 1);
    }
  }

  // --- Gender ---
  if (targeting.gender && targeting.gender.length && !targeting.gender.includes("all")) {
    // Approximate share per selected gender bucket.
    reach = Math.round(reach * Math.min(1, targeting.gender.length * 0.45));
  }

  // --- Age ---
  if (targeting.ageRange && (targeting.ageRange.min != null || targeting.ageRange.max != null)) {
    const min = targeting.ageRange.min ?? MINIMUM_TARGETABLE_AGE;
    const max = targeting.ageRange.max ?? 100;
    if (min < MINIMUM_TARGETABLE_AGE) {
      warnings.push(
        `Targeting includes a restricted age range. Minors cannot be targeted; the audience is limited to ages ${MINIMUM_TARGETABLE_AGE}+.`,
      );
    }
    const span = Math.max(1, Math.min(max, 100) - Math.max(min, MINIMUM_TARGETABLE_AGE));
    reach = Math.round(reach * Math.min(1, span / 60));
  }

  // --- Interests ---
  if (targeting.interests && targeting.interests.length) {
    // More interests = broader OR reach, but still a subset of the population.
    const interestFactor = Math.min(0.85, 0.18 + targeting.interests.length * 0.09);
    reach = Math.round(reach * interestFactor);
  }

  // --- Opt-outs ---
  const beforeOptOut = reach;
  reach = Math.round(reach * (1 - OPT_OUT_RATE));
  if (beforeOptOut !== reach) {
    warnings.push("Users who opted out of personalized ads are excluded from this estimate.");
  }

  // Deterministic jitter so the number feels real but is stable per-targeting.
  const seed = JSON.stringify(targeting);
  reach = Math.max(0, Math.round(reach * deterministicJitter(seed)));

  const minimumThresholdPassed = reach >= MINIMUM_AUDIENCE_THRESHOLD;
  if (!minimumThresholdPassed) {
    warnings.unshift(
      `Audience is too small. Broaden your targeting to reach at least ${MINIMUM_AUDIENCE_THRESHOLD.toLocaleString()} people.`,
    );
  }

  warnings.push("Estimated audience size may change before fulfillment.");

  return {
    estimatedAudienceSize: reach,
    minimumThresholdPassed,
    warnings,
  };
}
