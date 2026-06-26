"use client";

import Link from "next/link";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { Button } from "@/components/ui/Button";
import { Alert, EmptyState, LoadingState } from "@/components/ui/Feedback";
import { Icon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { useCampaigns } from "@/lib/use-campaigns";
import { formatCents, formatNumber, formatPercent } from "@/lib/format";
import type { CampaignStatus } from "@/types";

const PENDING_STATUSES: CampaignStatus[] = [
  "submitted",
  "pending_advertiser_verification",
  "pending_review",
  "approved",
];

export default function DashboardOverview() {
  const { activeAccount } = useAuth();
  const { campaigns, loading, error } = useCampaigns(activeAccount?.id);

  const counts = {
    active: campaigns.filter((c) => c.status === "active").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    pending: campaigns.filter((c) => PENDING_STATUSES.includes(c.status)).length,
    completed: campaigns.filter((c) => c.status === "completed").length,
  };

  const spendToDate = campaigns.reduce((sum, c) => sum + (c.pricing?.actualCost ?? 0), 0);
  const printed = campaigns.reduce((sum, c) => sum + (c.quantity?.actualPrintedQuantity ?? 0), 0);
  const mailed = campaigns.reduce((sum, c) => sum + (c.quantity?.actualMailedQuantity ?? 0), 0);

  const openRates = campaigns
    .map((c) => c.metrics?.estimatedOpenRate)
    .filter((r): r is number => typeof r === "number");
  const avgOpenRate = openRates.length
    ? openRates.reduce((a, b) => a + b, 0) / openRates.length
    : null;

  const recent = campaigns.slice(0, 5);

  return (
    <>
      <PageHeader
        title={`Welcome${activeAccount ? `, ${activeAccount.businessName}` : ""}`}
        description="Your physical mail advertising at a glance."
        actions={
          <Button href="/dashboard/campaigns/new" size="sm">
            <Icon name="plus" className="size-4" /> New campaign
          </Button>
        }
      />

      {activeAccount && activeAccount.verificationStatus !== "verified" ? (
        <Alert tone="warning" className="mb-6" title="Account pending verification">
          You can build and save campaigns now, but they can&apos;t run until your account is
          verified by our team. We&apos;ll review your business profile shortly.
        </Alert>
      ) : null}

      {error ? (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Active campaigns" value={counts.active} icon="play" tone="success" />
        <MetricCard label="Pending review" value={counts.pending} icon="eye" tone="info" />
        <MetricCard label="Drafts" value={counts.draft} icon="copy" tone="neutral" />
        <MetricCard label="Completed" value={counts.completed} icon="check" tone="brand" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Spend to date" value={formatCents(spendToDate)} icon="dollar" hint="Billed after fulfillment" />
        <MetricCard label="Ads printed" value={formatNumber(printed)} icon="printer" tone="neutral" />
        <MetricCard label="Ads mailed" value={formatNumber(mailed)} icon="mail" tone="neutral" />
        <MetricCard
          label="Avg. open rate"
          value={avgOpenRate == null ? "—" : formatPercent(avgOpenRate)}
          icon="target"
          tone="info"
          hint="Estimated"
        />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent campaigns</h2>
        <Link href="/dashboard/campaigns" className="text-sm font-medium text-brand-700 hover:underline">
          View all
        </Link>
      </div>

      <div className="mt-4">
        {loading ? (
          <LoadingState />
        ) : recent.length === 0 ? (
          <EmptyState
            icon={<Icon name="megaphone" className="size-6" />}
            title="No campaigns yet"
            description="Create your first physical mail campaign to start reaching real audiences."
            action={
              <Button href="/dashboard/campaigns/new">
                <Icon name="plus" className="size-4" /> Create campaign
              </Button>
            }
          />
        ) : (
          <CampaignTable campaigns={recent} />
        )}
      </div>
    </>
  );
}
