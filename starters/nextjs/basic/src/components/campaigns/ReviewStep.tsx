"use client";

import { AdPreview } from "./AdPreview";
import { Alert } from "@/components/ui/Feedback";
import { formatCents, formatNumber } from "@/lib/format";
import { CONTENT_POLICY_SUMMARY } from "@/config/content-policy";
import type { AdTier, AudienceEstimate, CampaignDraftInput } from "@/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export function ReviewStep({
  state,
  tier,
  estimate,
  estimatedCost,
  accountVerified,
}: {
  state: Omit<CampaignDraftInput, "advertiserAccountId">;
  tier: AdTier | null;
  estimate: AudienceEstimate;
  estimatedCost: number | null;
  accountVerified: boolean;
}) {
  const t = state.targeting;
  const audienceParts: string[] = [];
  if (t.locations?.cities?.length) audienceParts.push(`Cities: ${t.locations.cities.join(", ")}`);
  if (t.locations?.zipCodes?.length) audienceParts.push(`ZIPs: ${t.locations.zipCodes.join(", ")}`);
  if (t.locations?.radiusTargets?.length)
    audienceParts.push(
      `Radius: ${t.locations.radiusTargets.map((r) => `${r.radiusMiles}mi @ ${r.centerZipCode}`).join(", ")}`,
    );
  if (t.gender?.length) audienceParts.push(`Gender: ${t.gender.join(", ")}`);
  if (t.ageRange?.min || t.ageRange?.max)
    audienceParts.push(`Age: ${t.ageRange?.min ?? "18"}–${t.ageRange?.max ?? "100"}`);
  if (t.interests?.length) audienceParts.push(`Interests: ${t.interests.join(", ")}`);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Review &amp; submit</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface px-5">
          <Row label="Campaign name" value={state.name || "—"} />
          {state.goal ? <Row label="Goal" value={state.goal} /> : null}
          <Row label="Ad tier" value={tier?.name ?? "—"} />
          <Row label="Schedule" value={state.schedule.evergreen ? "Evergreen" : "Fixed dates"} />
          <Row label="Estimated audience" value={formatNumber(estimate.estimatedAudienceSize)} />
          <Row label="Desired quantity" value={formatNumber(state.quantity.desiredQuantity ?? null)} />
          <Row label="Estimated cost" value={estimatedCost == null ? "—" : `${formatCents(estimatedCost)} (est.)`} />
          <Row
            label="Artwork"
            value={
              state.creative.validationStatus === "valid" ? (
                <span className="text-success">Validated</span>
              ) : (
                <span className="text-danger">Not uploaded</span>
              )
            }
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">Target audience</p>
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-sm text-muted">
            {audienceParts.length ? (
              <ul className="space-y-1">
                {audienceParts.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            ) : (
              "Broad — no specific targeting selected."
            )}
          </div>
        </div>
      </div>

      {tier ? (
        <div>
          <p className="mb-2 text-sm font-medium">Creative preview</p>
          <AdPreview tier={tier} creative={state.creative} />
        </div>
      ) : null}

      {!accountVerified ? (
        <Alert tone="warning" title="Account not yet verified">
          You can submit now, but the campaign will wait at &ldquo;pending verification&rdquo; until
          your advertiser account is verified by our team.
        </Alert>
      ) : null}

      <Alert tone="info" title="Before you submit">
        <p>{CONTENT_POLICY_SUMMARY}</p>
        <p className="mt-2">
          Every campaign is manually reviewed before printing. Open rates are estimated. You&apos;re
          only charged after ads are printed and mailed.
        </p>
      </Alert>
    </div>
  );
}
