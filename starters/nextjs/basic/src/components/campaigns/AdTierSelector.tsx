"use client";

import { formatPrice } from "@/config/ad-tiers";
import { Icon } from "@/components/dashboard/icons";
import { cn } from "@/lib/cn";
import type { AdTier, AdTierId } from "@/types";

export function AdTierSelector({
  tiers,
  value,
  onChange,
}: {
  tiers: AdTier[];
  value: AdTierId | null;
  onChange: (id: AdTierId) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {tiers.map((tier) => {
        const selected = tier.id === value;
        return (
          <button
            type="button"
            key={tier.id}
            onClick={() => onChange(tier.id)}
            className={cn(
              "rounded-[var(--radius-lg)] border p-5 text-left transition-all",
              selected
                ? "border-brand-400 bg-brand-50/60 ring-2 ring-[var(--ring)]/25"
                : "border-border bg-surface hover:border-border-strong",
            )}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-foreground">{tier.name}</h3>
              <span
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border",
                  selected ? "border-brand-600 bg-brand-600 text-white" : "border-border-strong",
                )}
              >
                {selected ? <Icon name="check" className="size-3.5" /> : null}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted">{tier.description}</p>
            <div className="mt-4 flex items-end justify-between border-t border-border pt-3">
              <span className="text-lg font-semibold">{formatPrice(tier.pricePerPrintedAd)}</span>
              <span className="text-xs text-muted-2">
                {tier.dimensions.widthPx}×{tier.dimensions.heightPx}px · {tier.dimensions.dpi} DPI
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
