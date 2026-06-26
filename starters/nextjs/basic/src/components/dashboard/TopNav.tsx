"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "./icons";
import { VerificationBadge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

export function TopNav({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user, activeAccount, accounts, selectAccount, signOut } = useAuth();
  const router = useRouter();
  const [acctOpen, setAcctOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const acctRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (acctRef.current && !acctRef.current.contains(e.target as Node)) setAcctOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.replace("/");
  }

  const initials = (user?.displayName || user?.email || "?").slice(0, 1).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface/90 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="inline-flex size-9 items-center justify-center rounded-[var(--radius)] hover:bg-surface-muted lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>

        {/* Account switcher */}
        {activeAccount ? (
          <div className="relative" ref={acctRef}>
            <button
              onClick={() => setAcctOpen((v) => !v)}
              className="flex items-center gap-2 rounded-[var(--radius)] border border-border px-3 py-2 text-sm hover:bg-surface-muted"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-brand-50 text-xs font-semibold text-brand-700">
                {activeAccount.businessName.slice(0, 1).toUpperCase()}
              </span>
              <span className="max-w-40 truncate font-medium">{activeAccount.businessName}</span>
              <Icon name="chevronDown" className="size-4 text-muted-2" />
            </button>
            {acctOpen ? (
              <div className="absolute left-0 mt-2 w-64 rounded-[var(--radius-lg)] border border-border bg-surface p-1.5 shadow-lg">
                {accounts.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      selectAccount(a.id);
                      setAcctOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-[var(--radius)] px-3 py-2 text-left text-sm hover:bg-surface-muted",
                      a.id === activeAccount.id && "bg-surface-muted",
                    )}
                  >
                    <span className="truncate">{a.businessName}</span>
                    {a.id === activeAccount.id ? (
                      <Icon name="check" className="size-4 text-brand-600" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {activeAccount ? (
          <div className="hidden sm:block">
            <VerificationBadge status={activeAccount.verificationStatus} />
          </div>
        ) : null}
      </div>

      {/* User menu */}
      <div className="relative" ref={userRef}>
        <button
          onClick={() => setUserOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-border p-1 pr-3 hover:bg-surface-muted"
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-surface-inverse text-xs font-semibold text-on-inverse">
            {initials}
          </span>
          <span className="hidden max-w-32 truncate text-sm font-medium sm:block">
            {user?.displayName || user?.email}
          </span>
          <Icon name="chevronDown" className="size-4 text-muted-2" />
        </button>
        {userOpen ? (
          <div className="absolute right-0 mt-2 w-52 rounded-[var(--radius-lg)] border border-border bg-surface p-1.5 shadow-lg">
            <div className="border-b border-border px-3 py-2">
              <p className="truncate text-sm font-medium">{user?.displayName || "Account"}</p>
              <p className="truncate text-xs text-muted-2">{user?.email}</p>
            </div>
            <a href="/dashboard/settings" className="block rounded-[var(--radius)] px-3 py-2 text-sm hover:bg-surface-muted">
              Settings
            </a>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-left text-sm text-danger hover:bg-danger-bg"
            >
              <Icon name="logout" className="size-4" /> Sign out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
