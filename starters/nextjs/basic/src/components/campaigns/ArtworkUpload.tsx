"use client";

import { useRef, useState } from "react";
import { Icon } from "@/components/dashboard/icons";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { validateArtwork, type ArtworkValidationResult } from "@/lib/validate-artwork";
import { buildCreativeRecord, uploadArtwork } from "@/services/artwork";
import { formatNumber } from "@/lib/format";
import type { AdTier, Campaign } from "@/types";
import { cn } from "@/lib/cn";

export function ArtworkUpload({
  tier,
  accountId,
  campaignId,
  creative,
  onChange,
}: {
  tier: AdTier;
  accountId: string;
  campaignId: string;
  creative: Campaign["creative"];
  onChange: (creative: Campaign["creative"]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [validation, setValidation] = useState<ArtworkValidationResult | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    const result = await validateArtwork(file, tier);
    setValidation(result);

    if (!result.valid) {
      // Record the invalid attempt so submission is blocked.
      onChange({
        fileName: result.meta.fileName,
        fileType: result.meta.fileType,
        fileSizeBytes: result.meta.fileSizeBytes,
        widthPx: result.meta.widthPx,
        heightPx: result.meta.heightPx,
        validationStatus: "invalid",
        validationErrors: result.errors,
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const upload = await uploadArtwork({
        accountId,
        campaignId,
        file,
        onProgress: setProgress,
      });
      onChange(buildCreativeRecord(upload, result));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const accept = tier.printSpecs.allowedFileTypes.map((t) => `.${t}`).join(",");
  const hasValidUpload = creative.validationStatus === "valid" && creative.originalFileUrl;

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed px-6 py-10 text-center transition-colors",
          hasValidUpload ? "border-success/40 bg-success-bg/40" : "border-border-strong bg-surface-muted/40 hover:bg-surface-muted",
        )}
      >
        <span className="flex size-11 items-center justify-center rounded-full bg-surface text-brand-600 shadow-sm">
          <Icon name={hasValidUpload ? "check" : "image"} className="size-5" />
        </span>
        <span className="text-sm font-medium text-foreground">
          {hasValidUpload ? creative.fileName : "Click to upload or drag & drop"}
        </span>
        <span className="text-xs text-muted-2">
          {tier.printSpecs.allowedFileTypes.map((t) => t.toUpperCase()).join(", ")} · exactly{" "}
          {tier.dimensions.widthPx}×{tier.dimensions.heightPx}px · up to {tier.printSpecs.maxFileSizeMb} MB
        </span>
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onInput} />
      </button>

      {uploading ? (
        <div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-2">
              <Spinner /> Uploading…
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div className="h-full bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}

      {error ? <Alert tone="danger">{error}</Alert> : null}

      {validation && !validation.valid ? (
        <Alert tone="danger" title="Artwork didn't pass validation">
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {validation.errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Alert>
      ) : null}

      {hasValidUpload ? (
        <Alert tone="success" title="Artwork validated & uploaded">
          {creative.widthPx ? (
            <span>
              {formatNumber(creative.widthPx)}×{formatNumber(creative.heightPx)}px ·{" "}
              {creative.fileType?.toUpperCase()}
            </span>
          ) : null}
        </Alert>
      ) : null}

      {validation?.warnings.length ? (
        <Alert tone="warning" title="Print reminders">
          <ul className="mt-1 list-disc space-y-1 pl-4">
            {validation.warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </Alert>
      ) : null}
    </div>
  );
}
