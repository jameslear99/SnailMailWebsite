import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionHeading,
  AssetPlaceholder,
  FeatureCard,
} from "@/components/public/marketing";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "SnailMail Pro",
  description:
    "SnailMail Pro turns your friends' digital postcards into real envelopes that arrive at your mailbox — printed, sealed, and worth opening.",
};

const STEPS = [
  {
    n: "01",
    title: "Friends send you postcards",
    body: "In the SnailMail app, your friends share photos, notes, and little life updates — the same way they'd post anywhere else, except slower on purpose.",
  },
  {
    n: "02",
    title: "We print the real thing",
    body: "When you're on SnailMail Pro, those posts become actual postcards. We print them, tuck them together, and prepare a proper envelope for your address.",
  },
  {
    n: "03",
    title: "Your mailbox gets the good mail",
    body: "A physical envelope shows up at your door with posts from people you actually know. No junk. No mystery bills. Just friend mail you can hold, keep, and pin to the fridge.",
  },
] as const;

const PRO_PERKS = [
  {
    title: "Physical delivery",
    description:
      "Printed postcards from friends, mailed to your home. The whole point of SnailMail — slow, tangible, and delightful.",
  },
  {
    title: "Digital access too",
    description:
      "You still get everything in the app. Physical mail is the bonus layer, not a replacement for your digital mailbox.",
  },
  {
    title: "Worth waiting for",
    description:
      "Posts unlock digitally on a gentle delay for everyone. Pro members get the printed version headed to their real mailbox.",
  },
  {
    title: "Private address",
    description:
      "Your mailing address stays private. Friends never see it — we share it only with our print and mail partner to deliver your post.",
  },
] as const;

const FREE_VS_PRO = [
  { label: "Send & receive posts in the app", free: true, pro: true },
  { label: "Printed postcards in your mailbox", free: false, pro: true },
  { label: "Physical envelopes from friends", free: false, pro: true },
  { label: "Exclusive snail accessories", free: false, pro: true },
] as const;

export default function SnailMailProPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-glow relative overflow-hidden border-b border-border">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
              SnailMail Pro
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Your friends&apos; posts, delivered to your real mailbox.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              SnailMail Pro is the subscription that turns digital postcards from your
              friends into physical mail — printed, bundled, and sent to the address
              only you control.
            </p>
            <p className="mt-4 text-sm text-muted-2">
              Subscribe in the {SITE.shortName} app. US mailing addresses only for now.
            </p>
          </div>
          <AssetPlaceholder
            label="Envelope + postcards photography (coming soon)"
            ratio="aspect-[4/3]"
          />
        </Container>
      </section>

      {/* How it works */}
      <Section>
        <SectionHeading
          eyebrow="How it works"
          title="From app tap to mailbox thud"
          description="SnailMail Pro is simple: your friends post, we print, USPS does the dramatic finale."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-6"
            >
              <span className="font-mono text-sm font-semibold text-brand-600">
                {step.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Video placeholder */}
      <Section className="border-y border-border bg-surface">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <AssetPlaceholder
            label="SnailMail Pro video walkthrough (coming soon)"
            ratio="aspect-video"
          />
          <div>
            <SectionHeading
              align="left"
              eyebrow="See it in action"
              title="A video tour is on the way"
              description="We're putting together a short walkthrough of what arrives, when it arrives, and why it feels different from every other notification on your phone."
            />
            <p className="mt-4 text-sm text-muted">
              For now, imagine this: you open your mailbox, find an envelope with your
              name on it, and inside are postcards from people who thought of you —
              not an algorithm.
            </p>
          </div>
        </div>
      </Section>

      {/* Perks */}
      <Section>
        <SectionHeading
          eyebrow="Why Pro"
          title="Mail worth slowing down for"
          description="Free SnailMail is wonderful. Pro is for people who want the ritual — the envelope, the paper, the little gasp at the mailbox."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {PRO_PERKS.map((perk) => (
            <FeatureCard key={perk.title} title={perk.title} description={perk.description} />
          ))}
        </div>
      </Section>

      {/* Comparison */}
      <Section className="border-t border-border bg-surface-muted/40">
        <SectionHeading
          eyebrow="Free vs Pro"
          title="Everyone gets the app. Pro gets the mailbox."
        />
        <div className="mx-auto mt-12 max-w-2xl overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface">
          <div className="grid grid-cols-[1fr_72px_72px] gap-2 border-b border-border px-5 py-4 text-sm font-semibold text-muted">
            <span>Feature</span>
            <span className="text-center">Free</span>
            <span className="rounded-md bg-brand-50 py-1 text-center text-brand-700">
              Pro
            </span>
          </div>
          {FREE_VS_PRO.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_72px_72px] items-center gap-2 border-b border-border px-5 py-4 last:border-b-0"
            >
              <span className="text-sm text-foreground">{row.label}</span>
              <span className="text-center text-lg text-muted-2">
                {row.free ? "✓" : "—"}
              </span>
              <span className="text-center text-lg text-brand-600">✓</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-surface-inverse">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-on-inverse sm:text-4xl">
            Ready for mail that isn&apos;t bills?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-on-inverse/70">
            Open the SnailMail app, finish onboarding, and choose SnailMail Pro when
            you&apos;re ready for physical delivery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={SITE.appStoreUrl} size="lg">
              Get the app
            </Button>
            <Button href="/faq" variant="secondary" size="lg">
              Read the FAQ
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
