import type { Timestamp } from "firebase/firestore";

/**
 * Shared data model for Snail Mail Social's advertiser portal.
 *
 * These types describe the Firestore documents that are shared across:
 *  - this advertiser website,
 *  - the main Snail Mail Social mobile app (audience data source), and
 *  - the future internal admin portal (verification, review, fulfillment).
 *
 * Fields marked "admin/fulfillment" are written by future systems but are
 * declared here so the schema is stable and forward-compatible.
 */

export type FsTimestamp = Timestamp;

/* ------------------------------------------------------------------ */
/* Ad tiers                                                            */
/* ------------------------------------------------------------------ */

export type AdTierId =
  | "quarter_page"
  | "half_page"
  | "full_page_one_side"
  | "full_page_front_and_back";

export type AdTier = {
  id: AdTierId;
  name: "Quarter Page" | "Half Page" | "Full Page One Side" | "Full Page Front and Back";
  description: string;
  /** Price per printed ad, in USD cents. */
  pricePerPrintedAd: number;
  dimensions: {
    widthPx: number;
    heightPx: number;
    dpi: number;
  };
  printSpecs: {
    bleedInches: number;
    safeMarginInches: number;
    /** Lower-cased file extensions, e.g. ["png"]. */
    allowedFileTypes: string[];
    maxFileSizeMb: number;
  };
  active: boolean;
  sortOrder: number;
};

/* ------------------------------------------------------------------ */
/* Advertiser accounts + users                                         */
/* ------------------------------------------------------------------ */

export type VerificationStatus = "pending" | "verified" | "rejected" | "suspended";

export type AdvertiserRole = "owner" | "admin" | "marketer" | "viewer";

export type AdvertiserAccount = {
  id: string;
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  industry?: string;
  logoUrl?: string;

  /** Stripe customer id, created lazily when a payment method is added. */
  stripeCustomerId?: string;

  /** Set/managed by the future admin portal. Defaults to "pending". */
  verificationStatus: VerificationStatus;
  verificationNote?: string; // admin-only context

  /** Denormalized list of member uids for quick rules/queries. */
  memberUserIds: string[];

  createdByUserId: string;
  createdAt: FsTimestamp;
  updatedAt: FsTimestamp;
};

export type AdvertiserUser = {
  id: string; // firebase auth uid
  email: string;
  displayName?: string;
  /** Account memberships -> role. An advertiser may belong to multiple accounts. */
  accounts: Record<string, AdvertiserRole>;
  /** The account currently selected in the UI. */
  activeAccountId?: string;
  createdAt: FsTimestamp;
  updatedAt: FsTimestamp;
};

/* ------------------------------------------------------------------ */
/* Campaigns                                                           */
/* ------------------------------------------------------------------ */

export type CampaignStatus =
  | "draft"
  | "submitted"
  | "pending_advertiser_verification"
  | "pending_review"
  | "approved"
  | "active"
  | "paused"
  | "completed"
  | "rejected"
  | "cancelled";

export type CampaignTargeting = {
  locations?: {
    cities?: string[];
    zipCodes?: string[];
    radiusTargets?: {
      centerZipCode: string;
      radiusMiles: number;
    }[];
  };
  gender?: string[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  interests?: string[];
};

export type CreativeValidationStatus = "pending" | "valid" | "invalid";

export type Campaign = {
  id: string;
  advertiserAccountId: string;
  createdByUserId: string;

  name: string;
  goal?: string;

  status: CampaignStatus;

  adTierId: AdTierId;

  targeting: CampaignTargeting;

  estimatedAudienceSize?: number;
  minimumAudienceThresholdPassed?: boolean;

  schedule: {
    startDate?: FsTimestamp;
    endDate?: FsTimestamp;
    evergreen: boolean;
    requestedSendDates?: FsTimestamp[];
  };

  quantity: {
    desiredQuantity?: number;
    estimatedQuantity?: number;
    /** Written by fulfillment/admin. */
    actualPrintedQuantity?: number;
    actualMailedQuantity?: number;
  };

  pricing: {
    /** Snapshot of tier price (cents) at creation, for auditability. */
    pricePerPrintedAd: number;
    estimatedCost?: number;
    /** Written after fulfillment. */
    actualCost?: number;
    currency: "usd";
  };

  creative: {
    originalFileUrl?: string;
    /** Written by fulfillment/admin print prep. */
    printReadyFileUrl?: string;
    fileType?: string;
    fileName?: string;
    fileSizeBytes?: number;
    widthPx?: number;
    heightPx?: number;
    validationStatus?: CreativeValidationStatus;
    validationErrors?: string[];
    storagePath?: string;
  };

  metrics: {
    estimatedOpens?: number;
    bundleScans?: number;
    estimatedOpenRate?: number;
    advertiserQrScans?: number;
  };

  billing: {
    stripeCustomerId?: string;
    stripeInvoiceId?: string;
    stripePaymentIntentId?: string;
    billingStatus?: "not_ready" | "pending" | "invoiced" | "paid" | "failed";
  };

  review: {
    submittedAt?: FsTimestamp;
    reviewedAt?: FsTimestamp;
    reviewedBy?: string;
    rejectionReason?: string;
  };

  createdAt: FsTimestamp;
  updatedAt: FsTimestamp;
};

/** The campaign shape used while editing in the wizard (timestamps as millis). */
export type CampaignDraftInput = {
  id?: string;
  advertiserAccountId: string;
  name: string;
  goal?: string;
  adTierId: AdTierId | null;
  targeting: CampaignTargeting;
  estimatedAudienceSize?: number;
  minimumAudienceThresholdPassed?: boolean;
  schedule: {
    startDateMs?: number | null;
    endDateMs?: number | null;
    evergreen: boolean;
  };
  quantity: {
    desiredQuantity?: number;
    estimatedQuantity?: number;
  };
  creative: Campaign["creative"];
};

/* ------------------------------------------------------------------ */
/* Audience estimation                                                 */
/* ------------------------------------------------------------------ */

export type AudienceEstimate = {
  estimatedAudienceSize: number;
  minimumThresholdPassed: boolean;
  warnings: string[];
};

/* ------------------------------------------------------------------ */
/* Contact submissions                                                 */
/* ------------------------------------------------------------------ */

export type ContactTopic = "general" | "advertiser" | "support" | "partnership";

export type ContactSubmission = {
  id?: string;
  name: string;
  email: string;
  topic: ContactTopic;
  message: string;
  company?: string;
  createdAt?: FsTimestamp;
  /** admin workflow field */
  status?: "new" | "in_progress" | "resolved";
};

/* ------------------------------------------------------------------ */
/* Billing                                                             */
/* ------------------------------------------------------------------ */

export type PaymentMethodSummary = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
};

export type BillingEvent = {
  id: string;
  advertiserAccountId: string;
  campaignId?: string;
  type: "invoice" | "payment" | "charge";
  amount: number; // cents
  currency: "usd";
  status: string;
  description: string;
  stripeInvoiceId?: string;
  createdAt: FsTimestamp;
};
