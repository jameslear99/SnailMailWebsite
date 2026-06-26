"use client";

import { use, useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CampaignWizard } from "@/components/campaigns/CampaignWizard";
import { Alert, LoadingState } from "@/components/ui/Feedback";
import { Button } from "@/components/ui/Button";
import { getCampaign } from "@/services/campaigns";
import type { Campaign } from "@/types";

export default function EditCampaignPage({
  params,
}: {
  params: Promise<{ campaignId: string }>;
}) {
  const { campaignId } = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCampaign(campaignId)
      .then(setCampaign)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load campaign."))
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <LoadingState />;
  if (error) return <Alert tone="danger">{error}</Alert>;
  if (!campaign) return <Alert tone="danger">Campaign not found.</Alert>;

  if (campaign.status !== "draft") {
    return (
      <Alert tone="warning" title="This campaign can't be edited">
        Only draft campaigns can be edited. This campaign is{" "}
        <strong>{campaign.status.replace(/_/g, " ")}</strong>.
        <div className="mt-3">
          <Button href={`/dashboard/campaigns/${campaign.id}`} size="sm" variant="outline">
            View campaign
          </Button>
        </div>
      </Alert>
    );
  }

  return (
    <>
      <PageHeader title="Edit campaign" description="Update your draft and resubmit when ready." />
      <CampaignWizard campaign={campaign} />
    </>
  );
}
