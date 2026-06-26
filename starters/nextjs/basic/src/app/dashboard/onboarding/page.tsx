"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import { useAuth } from "@/lib/auth-context";
import { createAdvertiserAccount } from "@/services/advertisers";

const INDUSTRIES = [
  "Retail & E-commerce",
  "Food & Beverage",
  "Health & Wellness",
  "Home Services",
  "Real Estate",
  "Automotive",
  "Education",
  "Entertainment",
  "Nonprofit",
  "Professional Services",
  "Other",
];

export default function OnboardingPage() {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      await createAdvertiserAccount(user.uid, {
        businessName: String(f.get("businessName") || "").trim(),
        contactName: String(f.get("contactName") || user.displayName || "").trim(),
        contactEmail: String(f.get("contactEmail") || user.email || "").trim(),
        contactPhone: String(f.get("contactPhone") || "").trim(),
        website: String(f.get("website") || "").trim(),
        industry: String(f.get("industry") || "").trim(),
        address: {
          line1: String(f.get("line1") || "").trim(),
          city: String(f.get("city") || "").trim(),
          state: String(f.get("state") || "").trim(),
          postalCode: String(f.get("postalCode") || "").trim(),
          country: String(f.get("country") || "US").trim(),
        },
      });
      await refresh();
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-5 py-10">
      <div className="mb-8 flex items-center justify-between">
        <Logo />
        <span className="text-sm text-muted-2">Step 1 of 1</span>
      </div>

      <Card>
        <CardBody className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Set up your business profile</h1>
            <p className="mt-1 text-sm text-muted">
              Tell us about your business. You can create campaigns right away — they&apos;ll run
              once your account is verified.
            </p>
          </div>

          {error ? <Alert tone="danger">{error}</Alert> : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Business name" htmlFor="businessName">
              <Input id="businessName" name="businessName" required placeholder="Acme Coffee Co." />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact name" htmlFor="contactName">
                <Input
                  id="contactName"
                  name="contactName"
                  defaultValue={user?.displayName ?? ""}
                  required
                />
              </Field>
              <Field label="Contact email" htmlFor="contactEmail">
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  defaultValue={user?.email ?? ""}
                  required
                />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Contact phone" htmlFor="contactPhone" hint="(optional)">
                <Input id="contactPhone" name="contactPhone" placeholder="(555) 123-4567" />
              </Field>
              <Field label="Website" htmlFor="website" hint="(optional)">
                <Input id="website" name="website" placeholder="https://" />
              </Field>
            </div>
            <Field label="Industry" htmlFor="industry">
              <Select id="industry" name="industry" defaultValue="">
                <option value="" disabled>
                  Select an industry…
                </option>
                {INDUSTRIES.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="border-t border-border pt-5">
              <p className="mb-3 text-sm font-medium">Business address</p>
              <div className="space-y-4">
                <Field label="Street" htmlFor="line1">
                  <Input id="line1" name="line1" placeholder="123 Main St" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-4">
                  <Field label="City" htmlFor="city" className="sm:col-span-2">
                    <Input id="city" name="city" />
                  </Field>
                  <Field label="State" htmlFor="state">
                    <Input id="state" name="state" />
                  </Field>
                  <Field label="ZIP" htmlFor="postalCode">
                    <Input id="postalCode" name="postalCode" />
                  </Field>
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner /> : null}
              Create account & continue
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
