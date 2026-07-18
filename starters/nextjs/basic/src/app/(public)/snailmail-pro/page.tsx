import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionHeading,
  Eyebrow,
  FeatureCard,
} from "@/components/public/marketing";
import { AppScreenshot } from "@/components/public/marketing-visuals";
import { APP_SCREENSHOTS, APP_SCREENSHOT_LABELS, PRO_PAGE_PHOTOS } from "@/config/marketing-assets";
import { SITE } from "@/config/site";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "SnailMail Pro",
  description:
    "SnailMail Pro turns your friends' digital posts into real envelopes that arrive at your mailbox, printed, sealed, and worth opening.",
};

const STEPS = [
  {
    n: "01",
    title: "Friends post to you in the app",
    body: "Your people share square photos, little notes, and life updates, the same slow, intentional feed as free SnailMail. When you're on Pro, those posts are eligible for print.",
  },
  {
    n: "02",
    title: "We print & bundle the good stuff",
    body: "On a regular cadence, we turn friend posts into printed pages, tuck them into a branded envelope, and prep everything for USPS. No ads mixed in, just mail from people you chose.",
  },
  {
    n: "03",
    title: "It lands in your real mailbox",
    body: "You get a physical envelope at the address you verified in onboarding. Open it, read it, keep it. Scan the QR on the bundle to earn XP for your snail pal.",
  },
] as const;

const ARRIVES_ITEMS = [
  "A sealed SnailMail envelope addressed to you",
  "Printed posts from friends who shared while you were on Pro",
  "Square photos rendered on premium stock, readable, keepable, and fridge-worthy",
  "A QR code on the bundle so you can log the delivery in-app",
] as const;

const PRO_PERKS = [
  {
    title: "Physical delivery",
    description:
      "Friend posts become real printed mail in a real envelope. SnailMail Pro is the subscription for people who want the ritual, not just the feed.",
  },
  {
    title: "Digital + physical",
    description:
      "You still get every post in the app. Pro adds the printed layer: mail you can open, share at the table, and save in a drawer.",
  },
  {
    title: "Private by design",
    description:
      "Your mailing address never appears to friends. We share it only with our print-and-mail partner to deliver your bundles.",
  },
  {
    title: "Snail rewards",
    description:
      "Scan the QR when mail arrives to earn XP, level up your snail, and unlock accessories. Physical mail becomes part of the game.",
  },
] as const;

const FREE_VS_PRO = [
  { label: "Send & receive posts in the app", free: true, pro: true },
  { label: "Friend feed & snail pals", free: true, pro: true },
  { label: "Printed posts in your mailbox", free: false, pro: true },
  { label: "Physical envelopes from friends", free: false, pro: true },
  { label: "XP when you open physical mail", free: false, pro: true },
  { label: "Exclusive snail accessories", free: false, pro: true },
] as const;

const FAQ = [
  {
    q: "Who can subscribe?",
    a: "Anyone with a verified US mailing address in the SnailMail app. International physical delivery isn't available yet.",
  },
  {
    q: "How often does mail arrive?",
    a: "Bundles go out on a regular print cadence when friends have posted. You'll see timing and status in the app. Think weeks, not minutes.",
  },
  {
    q: "Do my friends need Pro too?",
    a: "No. Friends post normally. Your Pro subscription is what unlocks physical delivery of their posts to your mailbox.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Manage SnailMail Pro in the app. You'll keep digital access; new friend posts simply won't be queued for print after your subscription ends.",
  },
] as const;

function PhotoFrame({
  src,
  alt,
  credit,
  className,
  priority = false,
}: {
  src: string;
  alt: string;
  credit: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={cn("group", className)}>
      <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_24px_48px_-12px_rgb(14_16_20_/_0.16)] ring-1 ring-border/80">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 540px"
          />
        </div>
      </div>
      <figcaption className="mt-2 text-right text-[11px] text-muted-2">
        Photo: {credit}
      </figcaption>
    </figure>
  );
}

export default function SnailMailProPage() {
  const hero = PRO_PAGE_PHOTOS.hero;
  const whatArrives = PRO_PAGE_PHOTOS.whatArrives;
  const mailbox = PRO_PAGE_PHOTOS.mailbox;

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-hero-glow">
        <Container className="grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>SnailMail Pro</Eyebrow>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Friend mail that shows up at your door.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              SnailMail Pro is the paid tier that prints your friends&apos; digital posts and
              mails them to you in a real envelope. Same slow social feed, plus something you
              can hold.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              {[
                "Printed posts from people you actually know",
                "Bundled in a SnailMail envelope, delivered via USPS",
                "Still fully digital in the app. Pro adds the physical layer.",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={SITE.appStoreUrl} size="lg">
                Get the app
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg">
                How it works
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-2">
              Subscribe inside {SITE.shortName}. US mailing addresses only for now.
            </p>
          </div>
          <PhotoFrame
            src={hero.src}
            alt={hero.alt}
            credit={hero.credit}
            priority
          />
        </Container>
      </section>

      <Section className="border-b border-border bg-surface">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              eyebrow="What is Pro?"
              title="The app you already love, with a mailbox upgrade"
              description="Free SnailMail is a gentle social feed built around your snail pal. SnailMail Pro is for people who want that same feed to escape the screen and arrive as printed mail."
            />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              When a friend sends you a post, it lives in the app like always. With Pro,
              we also queue it for print, produce a physical copy, and include it in your next
              outbound bundle. You&apos;re not buying more content. You&apos;re buying
              delivery.
            </p>
          </div>
          <AppScreenshot
            src={APP_SCREENSHOTS.paywall}
            alt="SnailMail Pro subscription screen in the app"
            label={APP_SCREENSHOT_LABELS.paywall}
            className="mx-auto w-full max-w-[280px] lg:max-w-none"
          />
        </div>
      </Section>

      <Section id="how-it-works">
        <SectionHeading
          eyebrow="How it works"
          title="From app tap to mailbox thud"
          description="No mystery logistics. Friends post, we print on a schedule, and real mail shows up at the address you verified."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.n}
              className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-sm"
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

      <Section className="border-y border-border bg-surface-muted/30">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <PhotoFrame src={whatArrives.src} alt={whatArrives.alt} credit={whatArrives.credit} />
          <div>
            <SectionHeading
              align="left"
              eyebrow="What arrives"
              title="Not junk mail. Friend mail."
              description="Every bundle is personal by definition. It's only posts from people you're connected to in SnailMail."
            />
            <ul className="mt-8 space-y-4">
              {ARRIVES_ITEMS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-700">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <SectionHeading
              align="left"
              eyebrow="The moment"
              title="The kind of mail you actually want"
              description="Most of what's in a mailbox is bills and ads. SnailMail Pro is the opposite: a small stack of friend updates you didn't know you missed until you opened it."
            />
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Think of it as a periodic care package from your circle: photos from the
              hike they took, a note about their new job, a square snapshot of the dog.
              Slow on purpose. Worth keeping on the counter.
            </p>
          </div>
          <div className="order-1 lg:order-2">
            <PhotoFrame src={mailbox.src} alt={mailbox.alt} credit={mailbox.credit} />
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-surface">
        <SectionHeading
          eyebrow="Why Pro"
          title="Mail worth slowing down for"
          description="If you already enjoy the feed, Pro is the upgrade for people who want the envelope, the paper, and the little gasp at the mailbox."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {PRO_PERKS.map((perk) => (
            <FeatureCard key={perk.title} title={perk.title} description={perk.description} />
          ))}
        </div>
      </Section>

      <Section className="border-t border-border bg-surface-muted/40">
        <SectionHeading
          eyebrow="Free vs Pro"
          title="Everyone gets the app. Pro gets the mailbox."
          description="Start free, upgrade when you want physical delivery. Friends never need to pay for you to receive their posts in print."
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
              <span className="text-center text-sm text-muted-2">
                {row.free ? "✓" : "No"}
              </span>
              <span className="text-center text-lg text-brand-600">✓</span>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Questions"
          title="Common questions"
        />
        <dl className="mx-auto mt-12 grid max-w-3xl gap-6">
          {FAQ.map((item) => (
            <div
              key={item.q}
              className="rounded-[var(--radius-lg)] border border-border bg-surface p-6"
            >
              <dt className="font-semibold text-foreground">{item.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{item.a}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <section className="bg-surface-inverse">
        <Container className="py-16 text-center sm:py-20">
          <h2 className="text-3xl font-semibold tracking-tight text-on-inverse sm:text-4xl">
            Ready for mail that isn&apos;t bills?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-on-inverse/70">
            Download {SITE.shortName}, finish onboarding, and choose SnailMail Pro when
            you&apos;re ready for friend posts in your real mailbox.
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
