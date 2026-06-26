import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionHeading,
  Eyebrow,
  AssetPlaceholder,
  FeatureCard,
} from "@/components/public/marketing";
import { SITE } from "@/config/site";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-glow relative overflow-hidden border-b border-border">
        <Container className="grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2">
          <div>
            <Eyebrow>Physical social media</Eyebrow>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Social posts you can hold in your hands.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              {SITE.name} turns digital posts into beautiful printed mail bundles that friends
              actually open — and gives advertisers a smarter, more trackable way to reach real
              audiences through physical mail.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={SITE.appStoreUrl} size="lg">
                Download the app
              </Button>
              <Button href="/advertisers" variant="outline" size="lg">
                Advertise with us
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-2">
              No spam. No junk. Mail people are excited to receive.
            </p>
          </div>
          <div className="relative">
            <AssetPlaceholder label="App preview / mail bundle mockup" ratio="aspect-[4/5]" />
            <div className="absolute -bottom-5 -left-5 hidden w-40 sm:block">
              <AssetPlaceholder label="Snail art" ratio="aspect-square" className="bg-surface" />
            </div>
          </div>
        </Container>
      </section>

      {/* What it is */}
      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How it works"
          title="A social network that ends in the mailbox"
          description="Create posts in the app like any social feed. We bundle them, print them, and physically mail them to the people you choose."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Post in the app",
              body: "Share photos, notes, and updates with friends and family inside Snail Mail Social — just like a normal feed.",
            },
            {
              n: "02",
              title: "We bundle & print",
              body: "Your posts are collected into a printed bundle on a regular cadence, designed to feel personal and premium.",
            },
            {
              n: "03",
              title: "It arrives by mail",
              body: "The bundle is physically mailed. Recipients can scan a QR code to earn in-app XP for their snail.",
            },
          ].map((s) => (
            <div key={s.n} className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
              <span className="font-mono text-sm font-semibold text-brand-600">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why physical */}
      <Section className="border-y border-border bg-surface">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <AssetPlaceholder label="Bundle / envelope photography" ratio="aspect-[4/3]" />
          <div>
            <SectionHeading
              align="left"
              eyebrow="Why physical social media?"
              title="Attention is rare. The mailbox still gets opened."
            />
            <ul className="mt-6 space-y-4">
              {[
                "Physical mail commands focused, distraction-free attention that feeds can't match.",
                "A bundle of posts from people you care about is something to look forward to — not scroll past.",
                "It's tangible and keepable, so it lingers far longer than a digital impression.",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-muted">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* For advertisers */}
      <Section id="advertisers">
        <SectionHeading
          eyebrow="For advertisers"
          title="A smarter form of printed advertising"
          description="Reach real, targeted audiences inside mail people actually want — and only pay for ads that are physically printed and sent."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Targeted by real audiences"
            description="Target by location, age, gender, and interests from real user profiles — never individual user data."
          />
          <FeatureCard
            title="High-attention placement"
            description="Your ad rides inside a mail bundle recipients are genuinely excited to open."
          />
          <FeatureCard
            title="Pay per printed ad"
            description="Billing is based on the actual number of ads printed and sent. No minimum spend, no minimum quantity."
          />
          <FeatureCard
            title="Trackable performance"
            description="See printed and mailed counts, estimated opens, and spend — all in one dashboard."
          />
          <FeatureCard
            title="Estimated open tracking"
            description="Recipients scan a QR code for in-app XP, giving you an estimated open signal for each bundle."
          />
          <FeatureCard
            title="Your own QR codes"
            description="Include your own QR codes or tracking URLs in your artwork to measure response directly."
          />
        </div>
        <div className="mt-12 flex justify-center">
          <Button href="/advertisers" size="lg">
            Explore the advertiser platform
          </Button>
        </div>
      </Section>

      {/* CTA band */}
      <section className="bg-surface-inverse">
        <Container className="grid items-center gap-8 py-16 sm:py-20 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-on-inverse sm:text-4xl">
              Ready to reach people where they actually look?
            </h2>
            <p className="mt-4 max-w-lg text-lg text-on-inverse/70">
              Create a free advertiser account and build your first physical mail campaign in
              minutes. You&apos;re only charged after ads are printed and sent.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Button href="/signup" size="lg">
              Create advertiser account
            </Button>
            <Button href="/pricing" variant="secondary" size="lg">
              View pricing
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
