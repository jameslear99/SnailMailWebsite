import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  Section,
  SectionHeading,
  FeatureCard,
} from "@/components/public/marketing";
import { MailBundleRender } from "@/components/public/marketing-visuals";
import { AdvertiserWaitlistButton } from "@/components/public/advertiser-waitlist-modal";
import { CONTENT_POLICY_SUMMARY } from "@/config/content-policy";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Physical Advertising",
  description:
    "Snail Mail Social physical advertising is coming soon. Hyper-targeted print ads inside mail bundles people actually open.",
};

const BENEFITS = [
  {
    title: "A new demographic for print",
    description:
      "Reach digitally native audiences through physical mail — a channel they rarely get from brands they don't already follow.",
  },
  {
    title: "Hyper-targeted printed marketing",
    description:
      "Target by location, age, gender, and interests from real user profiles. Aggregated and anonymized — never individual user data.",
  },
  {
    title: "High-attention placement",
    description:
      "Your ad sits inside a bundle of friend posts people are excited to open — not buried in a junk-mail pile.",
  },
  {
    title: "Pay only for what's sent",
    description:
      "Billing is based on the actual number of ads printed and mailed. No minimum spend, no wasted print runs.",
  },
  {
    title: "Estimated open tracking",
    description:
      "Recipients scan a QR code for in-app XP when they open a bundle, giving you an estimated open signal per mail piece.",
  },
  {
    title: "Your own QR codes",
    description:
      "Embed your own QR codes or tracking URLs in artwork to measure response directly from print to action.",
  },
  {
    title: "Family-friendly by design",
    description:
      "Every campaign is manually reviewed before printing. All ads must be appropriate for a general audience.",
  },
  {
    title: "Less waste, more relevance",
    description:
      "Skip the carpet-bomb ZIP-code mailers. Reach people who opted in to a social mail experience they actually want.",
  },
];

const COMING_SOON_STEPS = [
  {
    title: "Target real audiences",
    body: "Choose location, age, gender, and interests built from real user profiles — fully anonymized and aggregated.",
  },
  {
    title: "Pay for what's sent",
    body: "You're billed on the actual number of ads printed and mailed, not estimates. No minimum spend.",
  },
  {
    title: "Track performance",
    body: "Monitor printed/mailed counts, estimated opens, QR scans, and spend per campaign.",
  },
  {
    title: "Measure opens",
    body: "Our scan-for-XP system gives an estimated open signal each time a recipient opens a bundle.",
  },
];

export default function AdvertisersPage() {
  return (
    <>
      <section className="bg-hero-glow border-b border-border">
        <Container className="py-20 text-center sm:py-24">
          <span className="inline-flex items-center rounded-full border border-accent/40 bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#8a6500]">
            Coming soon
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Physical advertising inside mail people actually open
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            The Snail Mail Social advertiser platform is launching soon. We&apos;re building a
            modern alternative to junk mail — targeted, engaging, trackable print ads included
            naturally inside mail bundles people look forward to receiving.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AdvertiserWaitlistButton source="advertisers" size="lg" />
            <Button href="/pricing" variant="outline" size="lg">
              Preview pricing
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <MailBundleRender />
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why Snail Mail ads"
              title="Print marketing that earns attention"
              description="Traditional direct mail is a blunt instrument. Snail Mail Social puts your brand inside personal mail bundles — a new kind of high-trust, high-attention print placement."
            />
          </div>
        </div>
      </Section>

      <Section className="border-y border-border bg-surface">
        <SectionHeading
          eyebrow="Benefits"
          title="What physical advertising on Snail Mail unlocks"
          description="We're designing the platform around relevance, accountability, and mail people genuinely want."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <FeatureCard key={b.title} title={b.title} description={b.description} />
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="How it will work"
          title="Built for brands that respect the mailbox"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {COMING_SOON_STEPS.map((s) => (
            <FeatureCard key={s.title} title={s.title} description={s.body} />
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-surface">
        <SectionHeading
          eyebrow="Junk mail vs. Snail Mail Social"
          title="Less waste. More relevance. Better results."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-4">
          {[
            ["Blasted to entire ZIP codes", "Targeted to relevant, opted-in audiences"],
            ["Tossed before it's read", "Opened as part of mail people look forward to"],
            ["No measurable feedback", "Estimated opens, QR scans, and spend tracking"],
            ["Pay for huge print runs", "Pay only for ads actually printed and sent"],
          ].map(([before, after]) => (
            <div
              key={before}
              className="grid grid-cols-2 gap-4 rounded-[var(--radius)] border border-border bg-background p-4"
            >
              <p className="text-sm text-muted-2 line-through">{before}</p>
              <p className="text-sm font-medium text-foreground">{after}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Built for trust"
          title="Privacy-first by design"
          description="Advertisers never see individual users. All targeting uses anonymized, aggregated audience estimates with strict guardrails."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            title="No individual data"
            description="You see aggregate audience estimates only — never personal user information."
          />
          <FeatureCard
            title="No targeting minors"
            description="Minors can't be targeted as a segment. Family-friendly ads may still reach them."
          />
          <FeatureCard
            title="Manual review"
            description="Every campaign is reviewed by our team before anything is printed."
          />
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-center text-sm text-muted">
          {CONTENT_POLICY_SUMMARY}
        </div>
      </Section>

      <section id="notify" className="bg-surface-inverse">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-on-inverse sm:text-4xl">
            Advertiser accounts opening soon
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-inverse/70">
            We&apos;re finishing the self-serve campaign builder and review workflow. Join the
            waitlist for early access or ask about pilot campaigns at{" "}
            <a
              href={`mailto:${SITE.advertiserEmail}`}
              className="text-on-inverse underline underline-offset-2"
            >
              {SITE.advertiserEmail}
            </a>
            .
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AdvertiserWaitlistButton source="advertisers" size="lg" variant="secondary" />
            <Button href="/pricing" variant="secondary" size="lg">
              Preview pricing
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
