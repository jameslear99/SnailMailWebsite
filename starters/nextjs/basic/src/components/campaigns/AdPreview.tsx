"use client";

import Image from "next/image";
import { QUARTER_PAGE_ADS_PER_PAGE } from "@/config/ad-tiers";
import { cn } from "@/lib/cn";
import type { AdTier, AdTierId, Campaign } from "@/types";

function AdImage({ creative, label }: { creative: Campaign["creative"]; label?: string }) {
  if (creative.originalFileUrl) {
    return (
      <Image
        src={creative.originalFileUrl}
        alt="Ad creative preview"
        fill
        className="object-contain"
        unoptimized
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted text-center text-xs text-muted-2">
      {label ?? "Your ad"}
    </div>
  );
}

/** Renders one bundle page with the ad placed according to its tier. */
function BundlePagePlacement({
  tierId,
  creative,
}: {
  tierId: AdTierId;
  creative: Campaign["creative"];
}) {
  if (tierId === "quarter_page") {
    return (
      <div className="grid aspect-[8.5/11] grid-cols-2 grid-rows-4 gap-1 rounded-md border border-border bg-surface p-1.5 shadow-sm">
        {Array.from({ length: QUARTER_PAGE_ADS_PER_PAGE }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "relative overflow-hidden rounded-sm",
              i === 0 ? "ring-2 ring-brand-500" : "bg-surface-muted/60",
            )}
          >
            {i === 0 ? <AdImage creative={creative} label="Your ad" /> : null}
          </div>
        ))}
      </div>
    );
  }
  if (tierId === "half_page") {
    return (
      <div className="flex aspect-[8.5/11] flex-col gap-1 rounded-md border border-border bg-surface p-1.5 shadow-sm">
        <div className="relative flex-1 overflow-hidden rounded-sm ring-2 ring-brand-500">
          <AdImage creative={creative} />
        </div>
        <div className="flex-1 rounded-sm bg-surface-muted/60" />
      </div>
    );
  }
  // Full page (one side or front of front-and-back)
  return (
    <div className="relative aspect-[8.5/11] overflow-hidden rounded-md border border-border bg-surface p-1.5 shadow-sm ring-2 ring-brand-500">
      <div className="relative h-full w-full overflow-hidden rounded-sm">
        <AdImage creative={creative} />
      </div>
    </div>
  );
}

export function AdPreview({ tier, creative }: { tier: AdTier; creative: Campaign["creative"] }) {
  const aspect = tier.dimensions.widthPx / tier.dimensions.heightPx;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Ad by itself */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Your ad</p>
        <div
          className="relative w-full overflow-hidden rounded-[var(--radius)] border border-border bg-surface shadow-sm"
          style={{ aspectRatio: aspect }}
        >
          <AdImage creative={creative} />
        </div>
        <p className="mt-2 text-xs text-muted-2">
          {tier.name} · {tier.dimensions.widthPx}×{tier.dimensions.heightPx}px
        </p>
      </div>

      {/* Inside a sample bundle */}
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">In a sample mail bundle</p>
        <div className="flex items-start gap-3">
          <div className="w-1/2">
            <BundlePagePlacement tierId={tier.id} creative={creative} />
          </div>
          {tier.id === "full_page_front_and_back" ? (
            <div className="w-1/2">
              <BundlePagePlacement tierId="full_page_one_side" creative={creative} />
              <p className="mt-1 text-center text-[10px] text-muted-2">Back</p>
            </div>
          ) : (
            <div className="w-1/2 rounded-md border border-dashed border-border bg-surface-muted/40 p-3 text-xs text-muted-2">
              Other posts &amp; ads in the bundle
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-2">
          Placement is illustrative. Final bundle layout is assigned during fulfillment.
        </p>
      </div>
    </div>
  );
}
