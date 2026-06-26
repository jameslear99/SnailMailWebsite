"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { AdPreview } from "@/components/campaigns/AdPreview";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CampaignStatusBadge } from "@/components/ui/Badge";
import { Alert, LoadingState } from "@/components/ui/Feedback";
import { ConfirmModal } from "@/components/ui/Modal";
import { Icon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import {
  cancelCampaign,
  duplicateCampaign,
  getCampaign,
  pauseCampaign,
  resumeCampaign,
  submitCampaign,
} from "@/services/campaigns";
import { getDefaultAdTier } from "@/config/ad-tiers";
import { campaignToCsv } from "@/lib/campaign-report";
import { downloadCsv } from "@/lib/csv";
import { formatCents, formatDate, formatNumber, formatPercent } from "@/lib/format";
import type { Campaign } from "@/types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = use(params);
  const { user, activeAccount } = useAuth();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<null | "pause" | "cancel" | "submit">(null);

  async function load() {
    try {
      setCampaign(await getCampaign(campaignId));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load campaign.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  if (loading) return <LoadingState />;
  if (error) return <Alert tone="danger">{error}</Alert>;
  if (!campaign) return <Alert tone="danger">Campaign not found.</Alert>;

  const tier = getDefaultAdTier(campaign.adTierId);
  const c = campaign;

  async function runAction(fn: () => Promise<unknown>) {
    setBusy(true);
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  async function handleDuplicate() {
    if (!user) return;
    setBusy(true);
    try {
      const id = await duplicateCampaign(c.id, user.uid);
      router.push(`/dashboard/campaigns/${id}/edit`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not duplicate.");
      setBusy(false);
    }
  }

  const verified = activeAccount?.verificationStatus === "verified";

  return (
    <>
      <PageHeader
        title={c.name}
        description={c.goal || undefined}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => downloadCsv(`${c.name}-report`, campaignToCsv(c))}>
              <Icon name="download" className="size-4" /> Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={busy}>
              <Icon name="copy" className="size-4" /> Duplicate
            </Button>
            {c.status === "draft" ? (
              <>
                <Button variant="outline" size="sm" href={`/dashboard/campaigns/${c.id}/edit`}>
                  Edit
                </Button>
                <Button size="sm" onClick={() => setConfirm("submit")} disabled={busy}>
                  <Icon name="send" className="size-4" /> Submit
                </Button>
              </>
            ) : null}
            {c.status === "active" ? (
              <Button variant="outline" size="sm" onClick={() => setConfirm("pause")} disabled={busy}>
                <Icon name="pause" className="size-4" /> Pause
              </Button>
            ) : null}
            {c.status === "paused" ? (
              <Button size="sm" onClick={() => runAction(() => resumeCampaign(c.id))} disabled={busy}>
                <Icon name="play" className="size-4" /> Resume
              </Button>
            ) : null}
          </div>
        }
      />

      <div className="mb-6 flex items-center gap-3">
        <CampaignStatusBadge status={c.status} />
        <span className="text-sm text-muted-2">Created {formatDate(c.createdAt)}</span>
      </div>

      {c.status === "rejected" && c.review?.rejectionReason ? (
        <Alert tone="danger" className="mb-6" title="Campaign rejected">
          {c.review.rejectionReason}
        </Alert>
      ) : null}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Ads printed" value={formatNumber(c.quantity?.actualPrintedQuantity)} icon="printer" tone="neutral" />
        <MetricCard label="Ads mailed" value={formatNumber(c.quantity?.actualMailedQuantity)} icon="mail" tone="neutral" />
        <MetricCard label="Est. open rate" value={formatPercent(c.metrics?.estimatedOpenRate)} icon="target" tone="info" hint="Estimated" />
        <MetricCard label="Spend to date" value={formatCents(c.pricing?.actualCost)} icon="dollar" hint="Billed after fulfillment" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign details</CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-border py-0">
            <Row label="Ad tier" value={tier?.name ?? c.adTierId} />
            <Row label="Schedule" value={c.schedule?.evergreen ? "Evergreen" : "Fixed dates"} />
            <Row label="Start" value={formatDate(c.schedule?.startDate)} />
            <Row label="End" value={formatDate(c.schedule?.endDate)} />
            <Row label="Estimated audience" value={formatNumber(c.estimatedAudienceSize)} />
            <Row label="Desired quantity" value={formatNumber(c.quantity?.desiredQuantity)} />
            <Row label="Estimated quantity" value={formatNumber(c.quantity?.estimatedQuantity)} />
            <Row label="Estimated cost" value={formatCents(c.pricing?.estimatedCost)} />
            <Row label="Price per printed ad" value={formatCents(c.pricing?.pricePerPrintedAd)} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tracking</CardTitle>
          </CardHeader>
          <CardBody className="divide-y divide-border py-0">
            <Row label="Estimated opens" value={formatNumber(c.metrics?.estimatedOpens)} />
            <Row label="Bundle scans" value={formatNumber(c.metrics?.bundleScans)} />
            <Row label="Advertiser QR scans" value={formatNumber(c.metrics?.advertiserQrScans)} />
            <Row label="Billing status" value={c.billing?.billingStatus ?? "not_ready"} />
          </CardBody>
          <CardBody>
            <p className="text-xs text-muted-2">
              Open metrics are estimated from optional QR scans recipients use to earn in-app XP.
              Not every recipient scans, so opens are approximate.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Creative */}
      {tier ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Creative</CardTitle>
          </CardHeader>
          <CardBody>
            {c.creative?.originalFileUrl ? (
              <AdPreview tier={tier} creative={c.creative} />
            ) : (
              <p className="text-sm text-muted">No artwork uploaded yet.</p>
            )}
          </CardBody>
        </Card>
      ) : null}

      {/* Danger zone for cancellable campaigns */}
      {["draft", "submitted", "pending_review", "pending_advertiser_verification", "approved", "paused"].includes(
        c.status,
      ) ? (
        <div className="mt-6">
          <Button variant="ghost" size="sm" className="text-danger" onClick={() => setConfirm("cancel")} disabled={busy}>
            Cancel campaign
          </Button>
        </div>
      ) : null}

      <ConfirmModal
        open={confirm === "submit"}
        title="Submit for review?"
        description={
          verified
            ? "Your campaign will be sent to our team for manual review before printing."
            : "Your account isn't verified yet, so the campaign will wait at pending verification until your account is approved."
        }
        confirmLabel="Submit"
        loading={busy}
        onConfirm={() => runAction(() => submitCampaign(c.id, verified))}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmModal
        open={confirm === "pause"}
        title="Pause this campaign?"
        description="Printing will stop until you resume it."
        confirmLabel="Pause"
        loading={busy}
        onConfirm={() => runAction(() => pauseCampaign(c.id))}
        onCancel={() => setConfirm(null)}
      />
      <ConfirmModal
        open={confirm === "cancel"}
        title="Cancel this campaign?"
        description="This stops the campaign. You can duplicate it later to start over."
        confirmLabel="Cancel campaign"
        tone="danger"
        loading={busy}
        onConfirm={() => runAction(() => cancelCampaign(c.id))}
        onCancel={() => setConfirm(null)}
      />
    </>
  );
}
