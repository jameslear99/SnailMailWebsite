import Link from "next/link";
import { CampaignStatusBadge } from "@/components/ui/Badge";
import { formatCents, formatDate, formatNumber } from "@/lib/format";
import { getDefaultAdTier } from "@/config/ad-tiers";
import type { Campaign } from "@/types";

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-2">
              <th className="px-5 py-3">Campaign</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Ad tier</th>
              <th className="px-5 py-3 text-right">Est. quantity</th>
              <th className="px-5 py-3 text-right">Est. cost</th>
              <th className="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((c) => {
              const tier = getDefaultAdTier(c.adTierId);
              return (
                <tr key={c.id} className="transition-colors hover:bg-surface-muted/50">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/dashboard/campaigns/${c.id}`}
                      className="font-medium text-foreground hover:text-brand-700"
                    >
                      {c.name}
                    </Link>
                    {c.goal ? <p className="text-xs text-muted-2">{c.goal}</p> : null}
                  </td>
                  <td className="px-5 py-3.5">
                    <CampaignStatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3.5 text-muted">{tier?.name ?? "—"}</td>
                  <td className="px-5 py-3.5 text-right text-muted">
                    {formatNumber(c.quantity?.estimatedQuantity)}
                  </td>
                  <td className="px-5 py-3.5 text-right text-muted">
                    {formatCents(c.pricing?.estimatedCost)}
                  </td>
                  <td className="px-5 py-3.5 text-muted">{formatDate(c.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
