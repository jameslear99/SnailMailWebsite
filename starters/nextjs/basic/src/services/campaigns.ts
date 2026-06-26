import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import { getDefaultAdTier } from "@/config/ad-tiers";
import type { Campaign, CampaignDraftInput, CampaignStatus } from "@/types";

/**
 * Campaign service. Reads/writes the shared `campaigns` collection that the
 * future admin portal consumes for review + fulfillment.
 *
 * Advertisers can never self-approve. Status transitions available here are
 * limited to advertiser-allowed actions (draft, submit, pause, cancel,
 * resume). Approval/active/completed transitions are reserved for the admin
 * portal.
 */

const COLLECTION = "campaigns";

function estimatedCostCents(pricePerAd: number, qty?: number): number | undefined {
  if (!qty || qty <= 0) return undefined;
  return pricePerAd * qty;
}

/** Build a Firestore-ready campaign payload from wizard draft input. */
function draftToFirestore(input: CampaignDraftInput, uid: string) {
  const tier = input.adTierId ? getDefaultAdTier(input.adTierId) : undefined;
  const pricePerPrintedAd = tier?.pricePerPrintedAd ?? 0;
  const estimatedQuantity = input.quantity.desiredQuantity;

  return {
    advertiserAccountId: input.advertiserAccountId,
    createdByUserId: uid,
    name: input.name || "Untitled campaign",
    goal: input.goal ?? "",
    adTierId: input.adTierId ?? "",
    targeting: input.targeting ?? {},
    estimatedAudienceSize: input.estimatedAudienceSize ?? null,
    minimumAudienceThresholdPassed: input.minimumAudienceThresholdPassed ?? false,
    schedule: {
      startDate: input.schedule.startDateMs ? Timestamp.fromMillis(input.schedule.startDateMs) : null,
      endDate: input.schedule.endDateMs ? Timestamp.fromMillis(input.schedule.endDateMs) : null,
      evergreen: input.schedule.evergreen,
      requestedSendDates: [],
    },
    quantity: {
      desiredQuantity: input.quantity.desiredQuantity ?? null,
      estimatedQuantity: estimatedQuantity ?? null,
      actualPrintedQuantity: null,
      actualMailedQuantity: null,
    },
    pricing: {
      pricePerPrintedAd,
      estimatedCost: estimatedCostCents(pricePerPrintedAd, estimatedQuantity) ?? null,
      actualCost: null,
      currency: "usd" as const,
    },
    creative: input.creative ?? { validationStatus: "pending" },
    metrics: {
      estimatedOpens: null,
      bundleScans: null,
      estimatedOpenRate: null,
      advertiserQrScans: null,
    },
    billing: {
      billingStatus: "not_ready" as const,
    },
    review: {},
    updatedAt: serverTimestamp(),
  };
}

export async function createCampaignDraft(
  input: CampaignDraftInput,
  uid: string,
): Promise<string> {
  const payload = draftToFirestore(input, uid);
  const ref = await addDoc(collection(getDb(), COLLECTION), {
    ...payload,
    status: "draft" satisfies CampaignStatus,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCampaignDraft(
  id: string,
  input: CampaignDraftInput,
  uid: string,
): Promise<void> {
  const payload = draftToFirestore(input, uid);
  await updateDoc(doc(getDb(), COLLECTION, id), payload);
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const snap = await getDoc(doc(getDb(), COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Campaign) : null;
}

export async function listCampaigns(accountId: string): Promise<Campaign[]> {
  const snap = await getDocs(
    query(
      collection(getDb(), COLLECTION),
      where("advertiserAccountId", "==", accountId),
      orderBy("createdAt", "desc"),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Campaign);
}

/**
 * Submit a campaign for review. If the advertiser account is not yet verified,
 * the campaign parks at `pending_advertiser_verification`; otherwise it moves to
 * `pending_review`. Either way it requires manual admin approval before it can
 * print — advertisers cannot self-approve.
 */
export async function submitCampaign(
  id: string,
  advertiserVerified: boolean,
): Promise<CampaignStatus> {
  const status: CampaignStatus = advertiserVerified
    ? "pending_review"
    : "pending_advertiser_verification";
  await updateDoc(doc(getDb(), COLLECTION, id), {
    status,
    "review.submittedAt": serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return status;
}

/** Advertiser pauses an active campaign. */
export async function pauseCampaign(id: string): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTION, id), {
    status: "paused" satisfies CampaignStatus,
    updatedAt: serverTimestamp(),
  });
}

/** Advertiser resumes a paused campaign. */
export async function resumeCampaign(id: string): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTION, id), {
    status: "active" satisfies CampaignStatus,
    updatedAt: serverTimestamp(),
  });
}

export async function cancelCampaign(id: string): Promise<void> {
  await updateDoc(doc(getDb(), COLLECTION, id), {
    status: "cancelled" satisfies CampaignStatus,
    updatedAt: serverTimestamp(),
  });
}

/** Duplicate an existing campaign as a fresh draft. */
export async function duplicateCampaign(id: string, uid: string): Promise<string> {
  const existing = await getCampaign(id);
  if (!existing) throw new Error("Campaign not found");

  const ref = await addDoc(collection(getDb(), COLLECTION), {
    advertiserAccountId: existing.advertiserAccountId,
    createdByUserId: uid,
    name: `${existing.name} (copy)`,
    goal: existing.goal ?? "",
    adTierId: existing.adTierId,
    targeting: existing.targeting,
    estimatedAudienceSize: existing.estimatedAudienceSize ?? null,
    minimumAudienceThresholdPassed: existing.minimumAudienceThresholdPassed ?? false,
    schedule: { ...existing.schedule, requestedSendDates: [] },
    quantity: {
      desiredQuantity: existing.quantity.desiredQuantity ?? null,
      estimatedQuantity: existing.quantity.estimatedQuantity ?? null,
      actualPrintedQuantity: null,
      actualMailedQuantity: null,
    },
    pricing: { ...existing.pricing, actualCost: null },
    // Creative must be re-uploaded/re-validated for the copy.
    creative: { validationStatus: "pending" },
    metrics: {},
    billing: { billingStatus: "not_ready" },
    review: {},
    status: "draft" satisfies CampaignStatus,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}
