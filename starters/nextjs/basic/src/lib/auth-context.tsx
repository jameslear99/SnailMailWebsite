"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import {
  ensureAdvertiserUser,
  getAccountsForUser,
  getAdvertiserUser,
  setActiveAccount as setActiveAccountSvc,
} from "@/services/advertisers";
import type { AdvertiserAccount, AdvertiserUser } from "@/types";

type AuthContextValue = {
  ready: boolean; // auth state resolved at least once
  loadingProfile: boolean;
  configured: boolean;
  user: User | null;
  advertiserUser: AdvertiserUser | null;
  accounts: AdvertiserAccount[];
  activeAccount: AdvertiserAccount | null;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  selectAccount: (accountId: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const configured = isFirebaseConfigured();
  const [ready, setReady] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [advertiserUser, setAdvertiserUser] = useState<AdvertiserUser | null>(null);
  const [accounts, setAccounts] = useState<AdvertiserAccount[]>([]);

  const loadProfile = useCallback(async (u: User) => {
    setLoadingProfile(true);
    try {
      const profile = await ensureAdvertiserUser({
        uid: u.uid,
        email: u.email ?? "",
        displayName: u.displayName ?? undefined,
      });
      const fresh = (await getAdvertiserUser(u.uid)) ?? profile;
      setAdvertiserUser(fresh);
      const accts = await getAccountsForUser(fresh);
      setAccounts(accts);
    } catch (err) {
      console.error("Failed to load advertiser profile", err);
      setAdvertiserUser(null);
      setAccounts([]);
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (!configured) {
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(getFirebaseAuth(), async (u) => {
      setUser(u);
      if (u) {
        await loadProfile(u);
      } else {
        setAdvertiserUser(null);
        setAccounts([]);
      }
      setReady(true);
    });
    return () => unsub();
  }, [configured, loadProfile]);

  const refresh = useCallback(async () => {
    if (user) await loadProfile(user);
  }, [user, loadProfile]);

  const signInEmail = useCallback(async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
  }, []);

  const signUpEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      if (displayName) await updateProfile(cred.user, { displayName });
      await ensureAdvertiserUser({ uid: cred.user.uid, email, displayName });
    },
    [],
  );

  const signInGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getFirebaseAuth(), provider);
  }, []);

  const signOut = useCallback(async () => {
    await fbSignOut(getFirebaseAuth());
  }, []);

  const selectAccount = useCallback(
    async (accountId: string) => {
      if (!user) return;
      await setActiveAccountSvc(user.uid, accountId);
      setAdvertiserUser((prev) => (prev ? { ...prev, activeAccountId: accountId } : prev));
    },
    [user],
  );

  const activeAccount = useMemo(() => {
    if (!accounts.length) return null;
    const activeId = advertiserUser?.activeAccountId;
    return accounts.find((a) => a.id === activeId) ?? accounts[0];
  }, [accounts, advertiserUser]);

  const value: AuthContextValue = {
    ready,
    loadingProfile,
    configured,
    user,
    advertiserUser,
    accounts,
    activeAccount,
    signInEmail,
    signUpEmail,
    signInGoogle,
    signOut,
    selectAccount,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
