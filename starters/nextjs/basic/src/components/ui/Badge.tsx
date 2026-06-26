import { cn } from "@/lib/cn";
import type { CampaignStatus, VerificationStatus } from "@/types";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-muted text-muted border-border",
  brand: "bg-brand-50 text-brand-700 border-brand-100",
  success: "bg-success-bg text-success border-transparent",
  warning: "bg-warning-bg text-warning border-transparent",
  danger: "bg-danger-bg text-danger border-transparent",
  info: "bg-info-bg text-info border-transparent",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

const CAMPAIGN_STATUS: Record<CampaignStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "neutral" },
  submitted: { label: "Submitted", tone: "info" },
  pending_advertiser_verification: { label: "Pending verification", tone: "warning" },
  pending_review: { label: "Pending review", tone: "warning" },
  approved: { label: "Approved", tone: "brand" },
  active: { label: "Active", tone: "success" },
  paused: { label: "Paused", tone: "neutral" },
  completed: { label: "Completed", tone: "info" },
  rejected: { label: "Rejected", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "danger" },
};

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = CAMPAIGN_STATUS[status] ?? CAMPAIGN_STATUS.draft;
  return (
    <Badge tone={cfg.tone}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {cfg.label}
    </Badge>
  );
}

const VERIFICATION: Record<VerificationStatus, { label: string; tone: Tone }> = {
  pending: { label: "Verification pending", tone: "warning" },
  verified: { label: "Verified", tone: "success" },
  rejected: { label: "Verification rejected", tone: "danger" },
  suspended: { label: "Suspended", tone: "danger" },
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const cfg = VERIFICATION[status] ?? VERIFICATION.pending;
  return <Badge tone={cfg.tone}>{cfg.label}</Badge>;
}
