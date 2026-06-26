import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  collection,
  documentId,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase/client";
import type { AdvertiserAccount, AdvertiserRole, AdvertiserUser } from "@/types";

/**
 * Advertiser account + user service. Collections shared with admin portal:
 *   advertiserAccounts, advertiserUsers
 */

const ACCOUNTS = "advertiserAccounts";
const USERS = "advertiserUsers";

export async function getAdvertiserUser(uid: string): Promise<AdvertiserUser | null> {
  const ref = doc(getDb(), USERS, uid);
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as AdvertiserUser) : null;
}

/** Create the advertiserUsers record on first login if it doesn't exist. */
export async function ensureAdvertiserUser(params: {
  uid: string;
  email: string;
  displayName?: string;
}): Promise<AdvertiserUser> {
  const ref = doc(getDb(), USERS, params.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return { id: snap.id, ...snap.data() } as AdvertiserUser;

  const data = {
    email: params.email,
    displayName: params.displayName ?? "",
    accounts: {} as Record<string, AdvertiserRole>,
    activeAccountId: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(ref, data);
  return { id: params.uid, ...(data as unknown as Omit<AdvertiserUser, "id">) };
}

export type CreateAccountInput = {
  businessName: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  industry?: string;
  address?: AdvertiserAccount["address"];
};

/** Create a new advertiser business account and link the creating user as owner. */
export async function createAdvertiserAccount(
  uid: string,
  input: CreateAccountInput,
): Promise<string> {
  const db = getDb();
  const accountRef = doc(collection(db, ACCOUNTS));
  await setDoc(accountRef, {
    businessName: input.businessName,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone ?? "",
    website: input.website ?? "",
    industry: input.industry ?? "",
    address: input.address ?? {},
    logoUrl: "",
    stripeCustomerId: "",
    // Anyone can create an account, but campaigns can't run until verified.
    verificationStatus: "pending",
    memberUserIds: [uid],
    createdByUserId: uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await updateDoc(doc(db, USERS, uid), {
    [`accounts.${accountRef.id}`]: "owner" satisfies AdvertiserRole,
    activeAccountId: accountRef.id,
    updatedAt: serverTimestamp(),
  });

  return accountRef.id;
}

export async function getAdvertiserAccount(id: string): Promise<AdvertiserAccount | null> {
  const snap = await getDoc(doc(getDb(), ACCOUNTS, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as AdvertiserAccount) : null;
}

/** Get all accounts a user belongs to. */
export async function getAccountsForUser(
  user: AdvertiserUser,
): Promise<AdvertiserAccount[]> {
  const ids = Object.keys(user.accounts ?? {});
  if (!ids.length) return [];
  // Firestore "in" supports up to 30 ids; advertisers will rarely exceed this.
  const snap = await getDocs(
    query(collection(getDb(), ACCOUNTS), where(documentId(), "in", ids.slice(0, 30))),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as AdvertiserAccount);
}

export async function setActiveAccount(uid: string, accountId: string): Promise<void> {
  await updateDoc(doc(getDb(), USERS, uid), {
    activeAccountId: accountId,
    updatedAt: serverTimestamp(),
  });
}

export async function updateAdvertiserAccount(
  id: string,
  updates: Partial<AdvertiserAccount>,
): Promise<void> {
  await updateDoc(doc(getDb(), ACCOUNTS, id), {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/** Invite/add a team member by uid (placeholder — full invite flow is future work). */
export async function addTeamMember(
  accountId: string,
  uid: string,
  role: AdvertiserRole,
): Promise<void> {
  const db = getDb();
  await updateDoc(doc(db, ACCOUNTS, accountId), {
    memberUserIds: arrayUnion(uid),
    updatedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, USERS, uid), {
    [`accounts.${accountId}`]: role,
    updatedAt: serverTimestamp(),
  });
}
