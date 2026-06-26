"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert, LoadingState, Spinner } from "@/components/ui/Feedback";
import { Icon } from "@/components/dashboard/icons";
import { AdTierSelector } from "./AdTierSelector";
import { TargetingForm } from "./TargetingForm";
import { AudienceEstimatorCard } from "./AudienceEstimatorCard";
import { ArtworkUpload } from "./ArtworkUpload";
import { AdPreview } from "./AdPreview";
import { ReviewStep } from "./ReviewStep";
import { useAuth } from "@/lib/auth-context";
import { getAdTiers } from "@/services/ad-tiers";
import { estimateAudience } from "@/services/audience";
import {
  createCampaignDraft,
  submitCampaign,
  updateCampaignDraft,
} from "@/services/campaigns";
import { formatCents } from "@/lib/format";
import { timestampToMs } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { AdTier, AdTierId, Campaign, CampaignDraftInput } from "@/types";

const STEPS = [
  "Basics",
  "Ad tier",
  "Audience",
  "Quantity",
  "Artwork",
  "Preview",
  "Review",
] as const;

type WizardState = Omit<CampaignDraftInput, "advertiserAccountId">;

function emptyState(): WizardState {
  return {
    name: "",
    goal: "",
    adTierId: null,
    targeting: {},
    schedule: { startDateMs: null, endDateMs: null, evergreen: false },
    quantity: {},
    creative: { validationStatus: "pending" },
  };
}

function fromCampaign(c: Campaign): WizardState {
  return {
    id: c.id,
    name: c.name,
    goal: c.goal,
    adTierId: c.adTierId || null,
    targeting: c.targeting ?? {},
    estimatedAudienceSize: c.estimatedAudienceSize,
    minimumAudienceThresholdPassed: c.minimumAudienceThresholdPassed,
    schedule: {
      startDateMs: timestampToMs(c.schedule?.startDate),
      endDateMs: timestampToMs(c.schedule?.endDate),
      evergreen: c.schedule?.evergreen ?? false,
    },
    quantity: {
      desiredQuantity: c.quantity?.desiredQuantity ?? undefined,
      estimatedQuantity: c.quantity?.estimatedQuantity ?? undefined,
    },
    creative: c.creative ?? { validationStatus: "pending" },
  };
}

function msToDateInput(ms?: number | null): string {
  if (!ms) return "";
  return new Date(ms).toISOString().slice(0, 10);
}

export function CampaignWizard({ campaign }: { campaign?: Campaign }) {
  const { user, activeAccount } = useAuth();
  const router = useRouter();

  const [state, setState] = useState<WizardState>(() =>
    campaign ? fromCampaign(campaign) : emptyState(),
  );
  const [campaignId, setCampaignId] = useState<string | undefined>(campaign?.id);
  const [step, setStep] = useState(0);
  const [tiers, setTiers] = useState<AdTier[]>([]);
  const [tiersLoading, setTiersLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdTiers()
      .then(setTiers)
      .finally(() => setTiersLoading(false));
  }, []);

  const selectedTier = useMemo(
    () => tiers.find((t) => t.id === state.adTierId) ?? null,
    [tiers, state.adTierId],
  );

  const estimate = useMemo(() => estimateAudience(state.targeting), [state.targeting]);

  const estimatedCost = useMemo(() => {
    if (!selectedTier || !state.quantity.desiredQuantity) return null;
    return selectedTier.pricePerPrintedAd * state.quantity.desiredQuantity;
  }, [selectedTier, state.quantity.desiredQuantity]);

  function patch(p: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...p }));
  }

  function buildInput(): CampaignDraftInput {
    return {
      ...state,
      advertiserAccountId: activeAccount!.id,
      estimatedAudienceSize: estimate.estimatedAudienceSize,
      minimumAudienceThresholdPassed: estimate.minimumThresholdPassed,
      adTierId: state.adTierId,
    };
  }

  /** Persist current draft, creating the doc on first save. Returns the id. */
  async function persist(): Promise<string> {
    if (!user || !activeAccount) throw new Error("Not signed in.");
    const input = buildInput();
    if (campaignId) {
      await updateCampaignDraft(campaignId, input, user.uid);
      return campaignId;
    }
    const id = await createCampaignDraft(input, user.uid);
    setCampaignId(id);
    return id;
  }

  async function saveDraft() {
    setError(null);
    setSaving(true);
    try {
      await persist();
      router.push("/dashboard/campaigns");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save draft.");
      setSaving(false);
    }
  }

  async function goNext() {
    setError(null);
    // Ensure a draft exists once we leave Basics so artwork upload has an id.
    if (step === 0) {
      setSaving(true);
      try {
        await persist();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not save.");
        setSaving(false);
        return;
      }
      setSaving(false);
    } else if (campaignId) {
      // Best-effort autosave on each step.
      try {
        await persist();
      } catch {
        /* non-blocking */
      }
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const id = await persist();
      const verified = activeAccount?.verificationStatus === "verified";
      await submitCampaign(id, verified);
      router.push(`/dashboard/campaigns/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit campaign.");
      setSubmitting(false);
    }
  }

  // Per-step gate for the Continue button.
  const canContinue = (() => {
    switch (step) {
      case 0:
        return state.name.trim().length > 0;
      case 1:
        return Boolean(state.adTierId);
      case 2:
        return estimate.minimumThresholdPassed;
      case 3:
        return Boolean(state.quantity.desiredQuantity && state.quantity.desiredQuantity > 0);
      case 4:
        return state.creative.validationStatus === "valid";
      default:
        return true;
    }
  })();

  if (!activeAccount) return <LoadingState />;

  return (
    <div className="mx-auto max-w-3xl">
      {/* Stepper */}
      <ol className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex size-6 items-center justify-center rounded-full text-xs font-semibold",
                i < step
                  ? "bg-brand-600 text-white"
                  : i === step
                    ? "bg-brand-50 text-brand-700 ring-2 ring-brand-400"
                    : "bg-surface-muted text-muted-2",
              )}
            >
              {i < step ? <Icon name="check" className="size-3.5" /> : i + 1}
            </span>
            <span className={cn(i === step ? "font-medium text-foreground" : "text-muted-2")}>
              {label}
            </span>
            {i < STEPS.length - 1 ? <span className="text-muted-2">›</span> : null}
          </li>
        ))}
      </ol>

      {error ? (
        <Alert tone="danger" className="mb-4">
          {error}
        </Alert>
      ) : null}

      <Card>
        <CardBody>
          {/* Step 1: Basics */}
          {step === 0 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Campaign basics</h2>
              <Field label="Campaign name" htmlFor="name">
                <Input
                  id="name"
                  value={state.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  placeholder="Spring promo — Austin"
                />
              </Field>
              <Field label="Business account">
                <Input value={activeAccount.businessName} disabled />
              </Field>
              <Field label="Campaign goal" htmlFor="goal" hint="(optional)">
                <Textarea
                  id="goal"
                  value={state.goal ?? ""}
                  onChange={(e) => patch({ goal: e.target.value })}
                  placeholder="Drive foot traffic to our new location."
                />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start date" htmlFor="start">
                  <Input
                    id="start"
                    type="date"
                    disabled={state.schedule.evergreen}
                    value={msToDateInput(state.schedule.startDateMs)}
                    onChange={(e) =>
                      patch({
                        schedule: {
                          ...state.schedule,
                          startDateMs: e.target.value ? new Date(e.target.value).getTime() : null,
                        },
                      })
                    }
                  />
                </Field>
                <Field label="End date" htmlFor="end">
                  <Input
                    id="end"
                    type="date"
                    disabled={state.schedule.evergreen}
                    value={msToDateInput(state.schedule.endDateMs)}
                    onChange={(e) =>
                      patch({
                        schedule: {
                          ...state.schedule,
                          endDateMs: e.target.value ? new Date(e.target.value).getTime() : null,
                        },
                      })
                    }
                  />
                </Field>
              </div>
              <label className="flex items-center gap-3 rounded-[var(--radius)] border border-border p-3">
                <input
                  type="checkbox"
                  className="size-4 accent-[var(--brand)]"
                  checked={state.schedule.evergreen}
                  onChange={(e) =>
                    patch({ schedule: { ...state.schedule, evergreen: e.target.checked } })
                  }
                />
                <span className="text-sm">
                  <span className="font-medium">Evergreen campaign</span>
                  <span className="block text-xs text-muted">
                    Runs continuously until paused, expired, or quantity is exhausted.
                  </span>
                </span>
              </label>
            </div>
          ) : null}

          {/* Step 2: Ad tier */}
          {step === 1 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Choose your ad tier</h2>
              {tiersLoading ? (
                <LoadingState />
              ) : (
                <AdTierSelector
                  tiers={tiers}
                  value={state.adTierId}
                  onChange={(id: AdTierId) => patch({ adTierId: id })}
                />
              )}
              {selectedTier ? (
                <div className="rounded-[var(--radius)] border border-border bg-surface-muted/40 p-4 text-sm text-muted">
                  <p className="font-medium text-foreground">Artwork requirements</p>
                  <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                    <li>Dimensions: {selectedTier.dimensions.widthPx}×{selectedTier.dimensions.heightPx}px</li>
                    <li>Resolution: {selectedTier.dimensions.dpi} DPI</li>
                    <li>Formats: {selectedTier.printSpecs.allowedFileTypes.map((t) => t.toUpperCase()).join(", ")}</li>
                    <li>Max size: {selectedTier.printSpecs.maxFileSizeMb} MB</li>
                    <li>Bleed: {selectedTier.printSpecs.bleedInches}&quot;</li>
                    <li>Safe margin: {selectedTier.printSpecs.safeMarginInches}&quot;</li>
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Step 3: Audience */}
          {step === 2 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Audience targeting</h2>
              <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                <TargetingForm value={state.targeting} onChange={(t) => patch({ targeting: t })} />
                <div className="lg:sticky lg:top-20 lg:self-start">
                  <AudienceEstimatorCard estimate={estimate} />
                </div>
              </div>
              {!estimate.minimumThresholdPassed ? (
                <Alert tone="warning">
                  Broaden your targeting to meet the minimum audience size before continuing.
                </Alert>
              ) : null}
            </div>
          ) : null}

          {/* Step 4: Quantity / budget / schedule */}
          {step === 3 ? (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold">Quantity &amp; budget</h2>
              <Field
                label="Desired number of printed ads"
                htmlFor="qty"
                hint="you're billed on actual quantity printed"
              >
                <Input
                  id="qty"
                  type="number"
                  min={1}
                  value={state.quantity.desiredQuantity ?? ""}
                  onChange={(e) =>
                    patch({
                      quantity: {
                        ...state.quantity,
                        desiredQuantity: e.target.value ? Number(e.target.value) : undefined,
                      },
                    })
                  }
                  placeholder="e.g. 5000"
                />
              </Field>

              <div className="rounded-[var(--radius-lg)] border border-border bg-surface-muted/40 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted">Estimated cost</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight">
                      {estimatedCost == null ? "—" : formatCents(estimatedCost)}
                    </p>
                  </div>
                  {selectedTier ? (
                    <p className="text-right text-xs text-muted-2">
                      {formatCents(selectedTier.pricePerPrintedAd)} × {state.quantity.desiredQuantity ?? 0} ads
                    </p>
                  ) : null}
                </div>
                <p className="mt-3 text-xs text-muted-2">
                  This is an estimate only. Final billing is based on the actual number of ads
                  printed and mailed. No upfront charge.
                </p>
              </div>

              {state.schedule.evergreen ? (
                <Alert tone="info">
                  This is an evergreen campaign — it runs until paused or the quantity is exhausted.
                </Alert>
              ) : (
                <p className="text-sm text-muted">
                  Scheduled{" "}
                  {state.schedule.startDateMs
                    ? new Date(state.schedule.startDateMs).toLocaleDateString()
                    : "—"}{" "}
                  to{" "}
                  {state.schedule.endDateMs
                    ? new Date(state.schedule.endDateMs).toLocaleDateString()
                    : "—"}
                  . Adjust dates in the Basics step.
                </p>
              )}
            </div>
          ) : null}

          {/* Step 5: Artwork */}
          {step === 4 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Upload artwork</h2>
              <p className="text-sm text-muted">
                Upload finished, print-ready artwork. We don&apos;t edit creative — your file is
                printed as provided once approved.
              </p>
              {selectedTier && campaignId ? (
                <ArtworkUpload
                  tier={selectedTier}
                  accountId={activeAccount.id}
                  campaignId={campaignId}
                  creative={state.creative}
                  onChange={(creative) => patch({ creative })}
                />
              ) : (
                <Alert tone="warning">Select an ad tier first.</Alert>
              )}
            </div>
          ) : null}

          {/* Step 6: Preview */}
          {step === 5 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Preview</h2>
              {selectedTier ? (
                <AdPreview tier={selectedTier} creative={state.creative} />
              ) : (
                <Alert tone="warning">Select an ad tier first.</Alert>
              )}
            </div>
          ) : null}

          {/* Step 7: Review & submit */}
          {step === 6 ? (
            <ReviewStep
              state={state}
              tier={selectedTier}
              estimate={estimate}
              estimatedCost={estimatedCost}
              accountVerified={activeAccount.verificationStatus === "verified"}
            />
          ) : null}
        </CardBody>
      </Card>

      {/* Footer controls */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
              Back
            </Button>
          ) : null}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveDraft} disabled={saving || submitting}>
            {saving ? <Spinner /> : null}
            Save draft
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={goNext} disabled={!canContinue || saving}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? <Spinner /> : <Icon name="send" className="size-4" />}
              Submit for review
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
