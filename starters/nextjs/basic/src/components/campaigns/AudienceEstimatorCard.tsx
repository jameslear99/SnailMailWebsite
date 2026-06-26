"use client";

import { Icon } from "@/components/dashboard/icons";
import { formatNumber } from "@/lib/format";
import { MINIMUM_AUDIENCE_THRESHOLD } from "@/config/targeting";
import type { AudienceEstimate } from "@/types";
import { cn } from "@/lib/cn";

export function AudienceEstimatorCard({ estimate }: { estimate: AudienceEstimate }) {
  const passed = estimate.minimumThresholdPassed;
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted">
        <Icon name="target" className="size-4 text-brand-600" />
        Estimated audience size
      </div>
      <p className="mt-2 text-3xl font-semibold tracking-tight">
        {formatNumber(estimate.estimatedAudienceSize)}
      </p>
      <div
        className={cn(
          "mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
          passed ? "bg-success-bg text-success" : "bg-warning-bg text-warning",
        )}
      >
        <Icon name={passed ? "check" : "alert"} className="size-3.5" />
        {passed
          ? "Meets minimum audience"
          : `Below minimum of ${formatNumber(MINIMUM_AUDIENCE_THRESHOLD)}`}
      </div>

      {estimate.warnings.length ? (
        <ul className="mt-4 space-y-2 border-t border-border pt-4">
          {estimate.warnings.map((w, i) => (
            <li key={i} className="flex gap-2 text-xs text-muted">
              <Icon name="alert" className="mt-0.5 size-3.5 shrink-0 text-muted-2" />
              {w}
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-xs text-muted-2">
        Estimates are aggregated and anonymized. Advertisers never see individual users.
      </p>
    </div>
  );
}
