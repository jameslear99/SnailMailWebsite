import { getDefaultAdTier } from "@/config/ad-tiers";
import { toCsv } from "@/lib/csv";
import { formatDate } from "@/lib/format";
import type { Campaign } from "@/types";

const REPORT_HEADERS = [
  "Campaign name",
  "Status",
  "Ad tier",
  "Start date",
  "End date",
  "Estimated quantity",
  "Printed quantity",
  "Mailed quantity",
  "Estimated opens",
  "Estimated open rate",
  "Spend (USD)",
  "Cost per estimated open (USD)",
];

function campaignToRow(c: Campaign): (string | number | null)[] {
  const tier = getDefaultAdTier(c.adTierId);
  const spendCents = c.pricing?.actualCost ?? 0;
  const estOpens = c.metrics?.estimatedOpens ?? null;
  const cpo = estOpens && estOpens > 0 ? spendCents / 100 / estOpens : null;
  return [
    c.name,
    c.status,
    tier?.name ?? c.adTierId,
    formatDate(c.schedule?.startDate),
    formatDate(c.schedule?.endDate),
    c.quantity?.estimatedQuantity ?? null,
    c.quantity?.actualPrintedQuantity ?? null,
    c.quantity?.actualMailedQuantity ?? null,
    estOpens,
    c.metrics?.estimatedOpenRate != null ? `${(c.metrics.estimatedOpenRate * 100).toFixed(1)}%` : null,
    (spendCents / 100).toFixed(2),
    cpo != null ? cpo.toFixed(4) : null,
  ];
}

export function campaignsToCsv(campaigns: Campaign[]): string {
  return toCsv(REPORT_HEADERS, campaigns.map(campaignToRow));
}

export function campaignToCsv(campaign: Campaign): string {
  return toCsv(REPORT_HEADERS, [campaignToRow(campaign)]);
}
