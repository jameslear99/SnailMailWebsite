"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CampaignTable } from "@/components/dashboard/CampaignTable";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Field";
import { Alert, EmptyState, LoadingState } from "@/components/ui/Feedback";
import { Icon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { useCampaigns } from "@/lib/use-campaigns";
import type { CampaignStatus } from "@/types";

const STATUS_FILTERS: { value: CampaignStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "draft", label: "Draft" },
  { value: "pending_review", label: "Pending review" },
  { value: "pending_advertiser_verification", label: "Pending verification" },
  { value: "approved", label: "Approved" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
  { value: "cancelled", label: "Cancelled" },
];

export default function CampaignsPage() {
  const { activeAccount } = useAuth();
  const { campaigns, loading, error } = useCampaigns(activeAccount?.id);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CampaignStatus | "all">("all");

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [campaigns, search, status]);

  return (
    <>
      <PageHeader
        title="Campaigns"
        description="Create, manage, and track your physical mail campaigns."
        actions={
          <Button href="/dashboard/campaigns/new" size="sm">
            <Icon name="plus" className="size-4" /> New campaign
          </Button>
        }
      />

      {error ? (
        <Alert tone="danger" className="mb-6">
          {error}
        </Alert>
      ) : null}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-2">
            <Icon name="search" className="size-4" />
          </span>
          <Input
            placeholder="Search campaigns by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value as CampaignStatus | "all")}
          className="sm:w-56"
        >
          {STATUS_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <LoadingState />
      ) : campaigns.length === 0 ? (
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
      ) : filtered.length === 0 ? (
        <EmptyState title="No campaigns match your filters" description="Try a different search or status." />
      ) : (
        <CampaignTable campaigns={filtered} />
      )}
    </>
  );
}
