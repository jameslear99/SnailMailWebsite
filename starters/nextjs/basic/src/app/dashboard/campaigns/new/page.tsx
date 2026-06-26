"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { CampaignWizard } from "@/components/campaigns/CampaignWizard";

export default function NewCampaignPage() {
  return (
    <>
      <PageHeader title="New campaign" description="Build a targeted physical mail campaign in a few steps." />
      <CampaignWizard />
    </>
  );
}
