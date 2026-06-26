import "server-only";
import * as admin from "firebase-admin";

/**
 * Server-side Firebase Admin SDK. Used by API routes (e.g. contact form,
 * future Stripe webhooks). Requires a service-account credential:
 *   - FIREBASE_SERVICE_ACCOUNT_JSON (single-line JSON), or
 *   - GOOGLE_APPLICATION_CREDENTIALS (absolute path to a key file).
 */

const DEFAULT_STORAGE_BUCKET =
  process.env.FIREBASE_STORAGE_BUCKET ??
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
  "snailmail-app.firebasestorage.app";

export function hasAdminCredentials(): boolean {
  if (process.env.FIREBASE_CONFIG?.trim()) return true;
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim(),
  );
}

export function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) return admin.app();

  // App Hosting injects FIREBASE_CONFIG; Admin SDK can init without explicit creds.
  if (process.env.FIREBASE_CONFIG?.trim() && !hasAdminCredentials()) {
    return admin.initializeApp({ storageBucket: DEFAULT_STORAGE_BUCKET });
  }

  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  if (json) {
    const credentials = JSON.parse(json) as admin.ServiceAccount;
    return admin.initializeApp({
      credential: admin.credential.cert(credentials),
      storageBucket: DEFAULT_STORAGE_BUCKET,
    });
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim()) {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: DEFAULT_STORAGE_BUCKET,
    });
  }

  throw new Error(
    "Firebase Admin has no credentials. Set FIREBASE_SERVICE_ACCOUNT_JSON or GOOGLE_APPLICATION_CREDENTIALS in .env.local.",
  );
}

export function getAdminDb(): admin.firestore.Firestore {
  return getAdminApp().firestore();
}

export function getAdminBucket() {
  return getAdminApp().storage().bucket(DEFAULT_STORAGE_BUCKET);
}

export { admin };
