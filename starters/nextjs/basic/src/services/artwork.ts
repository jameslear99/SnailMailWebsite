import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getStorageClient } from "@/lib/firebase/client";
import type { ArtworkValidationResult } from "@/lib/validate-artwork";
import type { Campaign } from "@/types";

/**
 * Artwork upload service. Uploads the original file to Firebase Storage and
 * returns a creative record for the campaign document.
 *
 * We store the ORIGINAL upload here. The print-ready processed version
 * (`printReadyFileUrl`) is produced later by the fulfillment/admin pipeline.
 */

export type UploadResult = {
  originalFileUrl: string;
  storagePath: string;
};

export function uploadArtwork(params: {
  accountId: string;
  campaignId: string;
  file: File;
  onProgress?: (pct: number) => void;
}): Promise<UploadResult> {
  const { accountId, campaignId, file, onProgress } = params;
  const storagePath = `advertiserCreatives/${accountId}/${campaignId}/original-${Date.now()}-${file.name}`;
  const storageRef = ref(getStorageClient(), storagePath);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise<UploadResult>((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) onProgress((snap.bytesTransferred / snap.totalBytes) * 100);
      },
      (err) => reject(err),
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ originalFileUrl: url, storagePath });
      },
    );
  });
}

/** Build the campaign.creative record from an upload + validation result. */
export function buildCreativeRecord(
  upload: UploadResult,
  validation: ArtworkValidationResult,
): Campaign["creative"] {
  return {
    originalFileUrl: upload.originalFileUrl,
    storagePath: upload.storagePath,
    fileType: validation.meta.fileType,
    fileName: validation.meta.fileName,
    fileSizeBytes: validation.meta.fileSizeBytes,
    widthPx: validation.meta.widthPx,
    heightPx: validation.meta.heightPx,
    validationStatus: validation.valid ? "valid" : "invalid",
    validationErrors: validation.errors,
  };
}
