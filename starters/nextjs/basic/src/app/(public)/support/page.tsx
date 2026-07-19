import type { Metadata } from "next";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/public/marketing";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Snail Mail Social — contact support, account deletion, subscriptions, and answers to common questions.",
};

const SUPPORT_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I contact support?",
    a: `Email us at ${SITE.email}. We read every message and respond as quickly as we can — usually within one to two business days.`,
  },
  {
    q: "What should I include in my support email?",
    a: "Your Snail Mail Social username (if you have one), the email address on your account, a short description of the issue, and your device type (iPhone or Android) plus app version if you know it. Screenshots help us resolve problems faster.",
  },
  {
    q: "How do I delete my account?",
    a: "Open the app, go to your profile, tap Privacy & delivery, then choose Delete account. Your data is permanently removed after a 14-day cooling-off period; you can sign back in before then to cancel deletion. You can also email us from the address on your account and ask us to start deletion on your behalf.",
  },
  {
    q: "How do I cancel SnailMail Pro?",
    a: "SnailMail Pro is billed through the Apple App Store or Google Play. Open your device subscription settings, find Snail Mail Social, and cancel there. We cannot cancel store subscriptions for you from this page.",
  },
  {
    q: "I didn't receive my physical mail. What should I do?",
    a: "First confirm your mailing address in the app is correct and that your friends are set up to receive mail from you. Delivery can take several business days after printing. If it has been longer than expected, email us with your username and the approximate send date so we can look into it.",
  },
  {
    q: "How do I update my mailing address?",
    a: "Open your profile in the app and edit your mailing address. Physical mail is sent to the address on file at the time bundles are prepared, so update it before your next send window if you have moved.",
  },
  {
    q: "How do I report inappropriate content?",
    a: "If you see content that violates our community guidelines, email us with the username involved and any details you can share. We review reports and may remove content or suspend accounts that break our Terms of Service.",
  },
  {
    q: "I'm having trouble signing in.",
    a: "Try the same sign-in method you used when you created your account (email and password, Apple, or Google). If you forgot your password, use the reset link on the login screen. Still stuck? Email us from the address on your account.",
  },
  {
    q: "What are the age requirements?",
    a: "You must be at least 13 years old to create a Snail Mail Social account. If you believe a child under 13 has signed up, contact us and we will take appropriate action.",
  },
];

export default function SupportPage() {
  return (
    <>
      <Section>
        <SectionHeading
          eyebrow="Support"
          title="We're here to help"
          description={`Need help with the Snail Mail Social app, your account, or physical mail delivery? Reach out and we'll get back to you.`}
        />

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Email support</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <p className="text-sm leading-relaxed text-muted">
                The fastest way to reach our team is by email. Send your question, bug report, or
                account request to:
              </p>
              <p>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-lg font-semibold text-brand hover:underline"
                >
                  {SITE.email}
                </a>
              </p>
              <p className="text-sm leading-relaxed text-muted">
                We typically respond within <strong className="font-medium text-foreground">1–2 business days</strong>.
                Messages about billing, account access, or undelivered mail are prioritized.
              </p>
              <Button href={`mailto:${SITE.email}`} className="w-full sm:w-auto">
                Email support
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before you write</CardTitle>
            </CardHeader>
            <CardBody>
              <ul className="space-y-3 text-sm leading-relaxed text-muted">
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">1.</span>
                  <span>Use the email address linked to your Snail Mail Social account when possible.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">2.</span>
                  <span>Include your username and a clear description of the problem.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">3.</span>
                  <span>Note your device (iPhone/Android) and app version from Settings if relevant.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-foreground">4.</span>
                  <span>Attach screenshots if something looks wrong in the app.</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </Section>

      <Section className="border-t border-border bg-surface-muted/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Account &amp; privacy
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-relaxed text-muted">
            <p>
              <strong className="font-medium text-foreground">Delete your account:</strong> In the
              app, open your profile → <strong className="font-medium text-foreground">Privacy &amp; delivery</strong> →{" "}
              <strong className="font-medium text-foreground">Delete account</strong>. After a 14-day
              cooling-off period, your profile, username, and mailing address are permanently removed.
              You can sign back in during that window to cancel deletion. To request deletion by email,
              write to{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand hover:underline">
                {SITE.email}
              </a>{" "}
              from the address on your account.
            </p>
            <p>
              <strong className="font-medium text-foreground">Privacy requests:</strong> For access,
              correction, or deletion of personal data, contact us at the same address or review our{" "}
              <Link href="/privacy" className="text-brand hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p>
              <strong className="font-medium text-foreground">Subscriptions:</strong> SnailMail Pro
              purchases are managed through the Apple App Store or Google Play. Cancel or change your
              plan in your device&apos;s subscription settings — not by emailing us.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="left"
          eyebrow="FAQ"
          title="Common questions"
          description="Quick answers for the issues we hear about most often."
          className="max-w-3xl"
        />
        <div className="mx-auto mt-10 max-w-3xl divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
          {SUPPORT_FAQS.map((item) => (
            <details key={item.q} className="group p-5 sm:p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
                {item.q}
                <span className="text-muted-2 transition-transform group-open:rotate-45">
                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface-muted/40 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-xl font-semibold text-foreground">More resources</h2>
          <p className="mt-2 text-sm text-muted">
            Advertiser questions, partnerships, and general inquiries can also go through our contact form.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" variant="outline" size="sm">
              Contact form
            </Button>
            <Button href="/faq" variant="outline" size="sm">
              Full FAQ
            </Button>
            <Button href="/privacy" variant="outline" size="sm">
              Privacy Policy
            </Button>
            <Button href="/terms" variant="outline" size="sm">
              Terms of Service
            </Button>
          </div>
          <p className="mt-8 text-xs text-muted-2">
            {SITE.company} · App support:{" "}
            <a href={`mailto:${SITE.email}`} className="hover:text-foreground hover:underline">
              {SITE.email}
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
