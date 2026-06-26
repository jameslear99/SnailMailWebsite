import "server-only";
import { getAdminApp, getAdminDb, hasAdminCredentials } from "./admin";

export type AuthedRequest = { uid: string; email: string | null };

/** Verify the Firebase ID token from the Authorization header. */
export async function verifyRequest(request: Request): Promise<AuthedRequest | null> {
  if (!hasAdminCredentials()) return null;
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  try {
    const decoded = await getAdminApp().auth().verifyIdToken(token);
    return { uid: decoded.uid, email: decoded.email ?? null };
  } catch {
    return null;
  }
}

/** Confirm the user is a member of the given advertiser account. */
export async function userInAccount(uid: string, accountId: string): Promise<boolean> {
  const snap = await getAdminDb().collection("advertiserAccounts").doc(accountId).get();
  if (!snap.exists) return false;
  const members = (snap.data()?.memberUserIds as string[] | undefined) ?? [];
  return members.includes(uid);
}
