"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert, Spinner } from "@/components/ui/Feedback";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function AdvertiserWaitlistModal({
  open,
  onClose,
  source,
}: {
  open: boolean;
  onClose: () => void;
  source: "advertisers" | "pricing" | "website";
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "sending") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, status]);

  useEffect(() => {
    if (!open) {
      setStatus("idle");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/advertiser-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-surface-inverse/40 backdrop-blur-sm"
        onClick={() => status !== "sending" && onClose()}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="advertiser-waitlist-title"
        className="relative w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-lg"
      >
        <h2 id="advertiser-waitlist-title" className="text-lg font-semibold text-foreground">
          Get notified at launch
        </h2>
        <p className="mt-2 text-sm text-muted">
          Leave your name and email. We&apos;ll reach out when advertiser accounts open.
        </p>

        {status === "sent" ? (
          <div className="mt-6">
            <Alert tone="success" title="You're on the list">
              Thanks! We&apos;ll email you when self-serve campaigns are ready.
            </Alert>
            <div className="mt-6 flex justify-end">
              <Button size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {status === "error" && error ? <Alert tone="danger">{error}</Alert> : null}
            <Field label="Name" htmlFor="waitlist-name">
              <Input id="waitlist-name" name="name" required placeholder="Jane Doe" />
            </Field>
            <Field label="Email" htmlFor="waitlist-email">
              <Input
                id="waitlist-email"
                name="email"
                type="email"
                required
                placeholder="jane@company.com"
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={status === "sending"}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={status === "sending"}>
                {status === "sending" ? <Spinner /> : null}
                Join waitlist
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export function AdvertiserWaitlistButton({
  children = "Get notified at launch",
  source,
  variant = "primary",
  size = "lg",
  className,
}: {
  children?: React.ReactNode;
  source: "advertisers" | "pricing" | "website";
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      <AdvertiserWaitlistModal
        open={open}
        onClose={() => setOpen(false)}
        source={source}
      />
    </>
  );
}
