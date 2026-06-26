import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  Section,
  SectionHeading,
  Eyebrow,
  AssetPlaceholder,
  FeatureCard,
} from "@/components/public/marketing";
import { CONTENT_POLICY_SUMMARY } from "@/config/content-policy";

export const metadata: Metadata = {
  title: "For Advertisers",
  description:
    "Reach real, targeted audiences through physical mail. Pay per printed ad, track performance, and run family-friendly campaigns reviewed before printing.",
};

const STEPS = [
  { title: "Target real audiences", body: "Choose location, age, gender, and interests built from real user profiles — fully anonymized and aggregated." },
  { title: "Pay for what's sent", body: "You're billed on the actual number of ads printed and mailed, not estimates. No minimum spend." },
  { title: "Track performance", body: "Monitor printed/mailed counts, estimated opens, QR scans, and spend per campaign." },
  { title: "Measure opens", body: "Our scan-for-XP system gives an estimated open signal each time a recipient opens a bundle." },
];

export default function AdvertisersPage() {
  return (
    <>
      <section className="bg-hero-glow border-b border-border">
        <Container className="py-20 text-center sm:py-24">
          <Eyebrow>Advertiser platform</Eyebrow>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            The modern alternative to junk mail
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
            Traditional print advertising is a blunt instrument. Snail Mail Social ads are targeted,
            engaging, and trackable — included naturally inside mail bundles people are excited to
            receive.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/signup" size="lg">
              Create advertiser account
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              See pricing
            </Button>
          </div>
        </Container>
      </section>

      <Section>
        <div className="grid gap-6 sm:grid-cols-2">
          {STEPS.map((s) => (
            <FeatureCard key={s.title} title={s.title} description={s.body} />
          ))}
        </div>
      </Section>

      <Section className="border-y border-border bg-surface">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Junk mail vs. Snail Mail Social"
              title="Less waste. More relevance. Better results."
            />
            <div className="mt-8 space-y-4">
              {[
                ["Blasted to entire ZIP codes", "Targeted to relevant, opted-in audiences"],
                ["Tossed before it's read", "Opened as part of mail people look forward to"],
                ["No measurable feedback", "Estimated opens, QR scans, and spend tracking"],
                ["Pay for huge print runs", "Pay only for ads actually printed and sent"],
              ].map(([before, after]) => (
                <div key={before} className="grid grid-cols-2 gap-4 rounded-[var(--radius)] border border-border bg-background p-4">
                  <p className="text-sm text-muted-2 line-through">{before}</p>
                  <p className="text-sm font-medium text-foreground">{after}</p>
                </div>
              ))}
            </div>
          </div>
          <AssetPlaceholder label="Campaign dashboard preview" ratio="aspect-[4/3]" />
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Built for trust"
          title="Privacy-first by design"
          description="Advertisers never see individual users. All targeting uses anonymized, aggregated audience estimates with strict guardrails."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <FeatureCard title="No individual data" description="You see aggregate audience estimates only — never personal user information." />
          <FeatureCard title="No targeting minors" description="Minors can't be targeted as a segment. Family-friendly ads may still reach them." />
          <FeatureCard title="Manual review" description="Every campaign is reviewed by our team before anything is printed." />
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-center text-sm text-muted">
          {CONTENT_POLICY_SUMMARY}
        </div>
      </Section>

      <section className="bg-surface-inverse">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-on-inverse sm:text-4xl">
            Launch your first physical mail campaign
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-on-inverse/70">
            Create an account, build a campaign, and submit it for review. You&apos;re only charged
            after ads are printed and sent.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/signup" size="lg">
              Get started free
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
