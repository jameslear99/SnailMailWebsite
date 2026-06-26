"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PUBLIC_NAV } from "@/config/site";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/cn";

export function PublicHeader() {
  const [open, setOpen] = useState(false);
  const { user, ready } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-[var(--radius)] px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {ready && user ? (
            <Button href="/dashboard" size="sm">
              Go to dashboard
            </Button>
          ) : (
            <>
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/signup" size="sm">
                Create advertiser account
              </Button>
            </>
          )}
        </div>

        <button
          className="inline-flex size-10 items-center justify-center rounded-[var(--radius)] text-foreground hover:bg-surface-muted md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </Container>

      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-border bg-surface transition-[max-height]",
          open ? "max-h-96" : "max-h-0 border-t-0",
        )}
      >
        <Container className="flex flex-col gap-1 py-4">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-muted"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            {ready && user ? (
              <Button href="/dashboard" className="w-full">
                Go to dashboard
              </Button>
            ) : (
              <>
                <Button href="/login" variant="outline" className="w-full">
                  Log in
                </Button>
                <Button href="/signup" className="w-full">
                  Create advertiser account
                </Button>
              </>
            )}
          </div>
        </Container>
      </div>
    </header>
  );
}
