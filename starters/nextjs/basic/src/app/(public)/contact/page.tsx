"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/public/marketing";
import { Card, CardBody } from "@/components/ui/Card";
import { Field, Input, Textarea, Select } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert, Spinner } from "@/components/ui/Feedback";
import type { ContactTopic } from "@/types";

const TOPICS: { value: ContactTopic; label: string }[] = [
  { value: "general", label: "General question" },
  { value: "advertiser", label: "Advertiser question" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership inquiry" },
];

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <Section>
      <SectionHeading
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about the app, advertising, support, or partnerships? Send us a note and we'll get back to you."
      />
      <div className="mx-auto mt-12 max-w-2xl">
        <Card>
          <CardBody>
            {status === "sent" ? (
              <Alert tone="success" title="Message sent">
                Thanks for reaching out — we&apos;ll reply by email soon.
              </Alert>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {status === "error" && error ? <Alert tone="danger">{error}</Alert> : null}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Name" htmlFor="name">
                    <Input id="name" name="name" required placeholder="Jane Doe" />
                  </Field>
                  <Field label="Email" htmlFor="email">
                    <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Company" htmlFor="company" hint="(optional)">
                    <Input id="company" name="company" placeholder="Acme Co." />
                  </Field>
                  <Field label="Topic" htmlFor="topic">
                    <Select id="topic" name="topic" defaultValue="general">
                      {TOPICS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>
                <Field label="Message" htmlFor="message">
                  <Textarea id="message" name="message" required placeholder="How can we help?" />
                </Field>
                <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
                  {status === "sending" ? <Spinner /> : null}
                  Send message
                </Button>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    </Section>
  );
}
