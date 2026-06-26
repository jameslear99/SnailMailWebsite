import type { AdTier } from "@/types";

/**
 * Client-side artwork validation. Initial supported format is PNG; the result
 * shape + checks are structured so JPG/PDF/SVG can be added later by extending
 * `allowedFileTypes` on the ad tier and the reader below.
 *
 * Campaigns cannot be submitted unless artwork passes validation.
 */

export type ArtworkValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  meta: {
    widthPx?: number;
    heightPx?: number;
    fileType: string;
    fileSizeBytes: number;
    fileName: string;
  };
};

const DIMENSION_TOLERANCE = 0.02; // allow 2% off the target dimensions

function getExtension(name: string): string {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

async function readImageDimensions(
  file: File,
): Promise<{ width: number; height: number } | null> {
  // Raster formats only for now (PNG/JPG). Vector/PDF handled when added later.
  if (!file.type.startsWith("image/")) return null;
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

export async function validateArtwork(
  file: File,
  tier: AdTier,
): Promise<ArtworkValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ext = getExtension(file.name);

  // --- File type ---
  if (!tier.printSpecs.allowedFileTypes.includes(ext)) {
    errors.push(
      `File type ".${ext}" is not allowed. Accepted: ${tier.printSpecs.allowedFileTypes
        .map((t) => `.${t}`)
        .join(", ")}.`,
    );
  }

  // --- File size ---
  const maxBytes = tier.printSpecs.maxFileSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    errors.push(
      `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — exceeds the ${tier.printSpecs.maxFileSizeMb} MB limit for ${tier.name}.`,
    );
  }

  // --- Dimensions / resolution ---
  const dims = await readImageDimensions(file);
  if (dims) {
    const targetW = tier.dimensions.widthPx;
    const targetH = tier.dimensions.heightPx;
    const wOff = Math.abs(dims.width - targetW) / targetW;
    const hOff = Math.abs(dims.height - targetH) / targetH;

    // Orientation/layout compatibility
    const targetLandscape = targetW >= targetH;
    const fileLandscape = dims.width >= dims.height;
    if (targetLandscape !== fileLandscape) {
      errors.push(
        `Orientation mismatch: ${tier.name} expects ${targetLandscape ? "landscape" : "portrait"} artwork.`,
      );
    }

    if (wOff > DIMENSION_TOLERANCE || hOff > DIMENSION_TOLERANCE) {
      errors.push(
        `Dimensions ${dims.width}×${dims.height}px do not match the required ${targetW}×${targetH}px (at ${tier.dimensions.dpi} DPI).`,
      );
    }

    // Minimum resolution (smaller than target = too low-res to print).
    if (dims.width < targetW * (1 - DIMENSION_TOLERANCE)) {
      warnings.push("Image resolution is below the recommended print resolution.");
    }
  } else if (file.type.startsWith("image/")) {
    errors.push("Could not read image dimensions. The file may be corrupt.");
  } else {
    warnings.push(
      "Dimension checks are not yet available for this file type and will be confirmed during manual review.",
    );
  }

  // --- Print-safe margin reminder (cannot inspect pixels here) ---
  warnings.push(
    `Keep important content within the safe margin (${tier.printSpecs.safeMarginInches}") and extend backgrounds into the ${tier.printSpecs.bleedInches}" bleed.`,
  );

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    meta: {
      widthPx: dims?.width,
      heightPx: dims?.height,
      fileType: ext,
      fileSizeBytes: file.size,
      fileName: file.name,
    },
  };
}
