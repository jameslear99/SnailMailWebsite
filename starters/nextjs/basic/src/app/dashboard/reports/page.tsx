"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Alert, EmptyState, LoadingState } from "@/components/ui/Feedback";
import { CampaignStatusBadge } from "@/components/ui/Badge";
import { Icon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { useCampaigns } from "@/lib/use-campaigns";
import { campaignsToCsv, campaignToCsv } from "@/lib/campaign-report";
import { downloadCsv } from "@/lib/csv";
import { getDefaultAdTier } from "@/config/ad-tiers";
import { formatCents, formatNumber, formatPercent } from "@/lib/format";

export default function ReportsPage() {
  const { activeAccount } = useAuth();
  const { campaigns, loading, error } = useCampaigns(activeAccount?.id);

  return (
    <>
      <PageHeader
        title="Reports"
        description="Performance across your campaigns. Export to CSV for your own analysis."
        actions={
          <Button
            size="sm"
            onClick={() => downloadCsv("snailmail-campaigns-report", campaignsToCsv(campaigns))}
            disabled={!campaigns.length}
          >
            <Icon name="download" className="size-4" /> Export all (CSV)
          </Button>
        }
      />

      {error ? (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <LoadingState />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={<Icon name="chart" className="size-6" />}
          title="No data yet"
          description="Once you launch campaigns, performance reports will appear here."
        />
      ) : (
        <Card>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-2">
                    <th className="px-5 py-3">Campaign</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Tier</th>
                    <th className="px-5 py-3 text-right">Printed</th>
                    <th className="px-5 py-3 text-right">Mailed</th>
                    <th className="px-5 py-3 text-right">Est. opens</th>
                    <th className="px-5 py-3 text-right">Open rate</th>
                    <th className="px-5 py-3 text-right">Spend</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-muted/50">
                      <td className="px-5 py-3.5 font-medium">{c.name}</td>
                      <td className="px-5 py-3.5">
                        <CampaignStatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-3.5 text-muted">{getDefaultAdTier(c.adTierId)?.name ?? "—"}</td>
                      <td className="px-5 py-3.5 text-right text-muted">{formatNumber(c.quantity?.actualPrintedQuantity)}</td>
                      <td className="px-5 py-3.5 text-right text-muted">{formatNumber(c.quantity?.actualMailedQuantity)}</td>
                      <td className="px-5 py-3.5 text-right text-muted">{formatNumber(c.metrics?.estimatedOpens)}</td>
                      <td className="px-5 py-3.5 text-right text-muted">{formatPercent(c.metrics?.estimatedOpenRate)}</td>
                      <td className="px-5 py-3.5 text-right text-muted">{formatCents(c.pricing?.actualCost)}</td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => downloadCsv(`${c.name}-report`, campaignToCsv(c))}
                          className="text-muted-2 hover:text-brand-700"
                          aria-label="Export campaign CSV"
                          title="Export CSV"
                        >
                          <Icon name="download" className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      <p className="mt-4 text-xs text-muted-2">
        Start/end dates, estimated open rate, and cost per estimated open are included in CSV
        exports. Open metrics are estimated.
      </p>
    </>
  );
}
