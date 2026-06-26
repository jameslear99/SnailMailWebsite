"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { VerificationBadge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/auth-context";
import { updateAdvertiserAccount } from "@/services/advertisers";

export default function SettingsPage() {
  const { activeAccount, refresh } = useAuth();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!activeAccount) return null;
  const a = activeAccount;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      await updateAdvertiserAccount(a.id, {
        businessName: String(f.get("businessName") || "").trim(),
        contactName: String(f.get("contactName") || "").trim(),
        contactEmail: String(f.get("contactEmail") || "").trim(),
        contactPhone: String(f.get("contactPhone") || "").trim(),
        website: String(f.get("website") || "").trim(),
        industry: String(f.get("industry") || "").trim(),
        address: {
          ...a.address,
          line1: String(f.get("line1") || "").trim(),
          city: String(f.get("city") || "").trim(),
          state: String(f.get("state") || "").trim(),
          postalCode: String(f.get("postalCode") || "").trim(),
        },
      });
      await refresh();
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" description="Manage your business profile." />

      <div className="mb-6 flex items-center gap-3">
        <VerificationBadge status={a.verificationStatus} />
        {a.verificationStatus !== "verified" ? (
          <span className="text-sm text-muted-2">Campaigns can run once your account is verified.</span>
        ) : null}
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Business profile</CardTitle>
        </CardHeader>
        <CardBody>
          {status === "saved" ? <Alert tone="success" className="mb-4">Changes saved.</Alert> : null}
          {status === "error" && error ? <Alert tone="danger" className="mb-4">{error}</Alert> : null}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Business name" htmlFor="businessName">
              <Input id="businessName" name="businessName" defaultValue={a.businessName} required />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact name" htmlFor="contactName">
                <Input id="contactName" name="contactName" defaultValue={a.contactName} />
              </Field>
              <Field label="Contact email" htmlFor="contactEmail">
                <Input id="contactEmail" name="contactEmail" type="email" defaultValue={a.contactEmail} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact phone" htmlFor="contactPhone">
                <Input id="contactPhone" name="contactPhone" defaultValue={a.contactPhone ?? ""} />
              </Field>
              <Field label="Website" htmlFor="website">
                <Input id="website" name="website" defaultValue={a.website ?? ""} />
              </Field>
            </div>
            <Field label="Industry" htmlFor="industry">
              <Input id="industry" name="industry" defaultValue={a.industry ?? ""} />
            </Field>

            <div className="border-t border-border pt-5">
              <p className="mb-3 text-sm font-medium">Business address</p>
              <div className="space-y-4">
                <Field label="Street" htmlFor="line1">
                  <Input id="line1" name="line1" defaultValue={a.address?.line1 ?? ""} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-4">
                  <Field label="City" htmlFor="city" className="sm:col-span-2">
                    <Input id="city" name="city" defaultValue={a.address?.city ?? ""} />
                  </Field>
                  <Field label="State" htmlFor="state">
                    <Input id="state" name="state" defaultValue={a.address?.state ?? ""} />
                  </Field>
                  <Field label="ZIP" htmlFor="postalCode">
                    <Input id="postalCode" name="postalCode" defaultValue={a.address?.postalCode ?? ""} />
                  </Field>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? <Spinner /> : null}
              Save changes
            </Button>
          </form>
        </CardBody>
      </Card>
    </>
  );
}
