"use client";

import { useCallback, useEffect, useState } from "react";
import { listCampaigns } from "@/services/campaigns";
import type { Campaign } from "@/types";

/** Loads campaigns for an advertiser account with loading/error/refresh state. */
export function useCampaigns(accountId: string | undefined) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!accountId) {
      setCampaigns([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setCampaigns(await listCampaigns(accountId));
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Could not load campaigns. Check your connection.",
      );
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    load();
  }, [load]);

  return { campaigns, loading, error, refresh: load };
}
