import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import {
  Section,
  SectionHeading,
  Eyebrow,
} from "@/components/public/marketing";
import {
  LandingHero,
  PhysicalMailFlow,
  SnailArtComposite,
} from "@/components/public/marketing-visuals";
import { SnailScrollWall } from "@/components/public/snail-scroll-wall";
import { HOME_SNAIL_PLACEMENTS, formatSnailCombinationCount } from "@/config/marketing-assets";
import { SITE } from "@/config/site";

export default function HomePage() {
  const combinationLabel = formatSnailCombinationCount();

  return (
    <>
      <LandingHero
        headline={
          <>
            <Eyebrow className="mb-5">Physical social media</Eyebrow>
            <h1 className="max-w-xl text-[2.5rem] font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
              Social posts you can hold in your hands.
            </h1>
          </>
        }
        subhead={
          <p className="max-w-md text-lg leading-relaxed text-muted">
            {SITE.name} turns digital posts into beautiful printed mail bundles that friends
            actually open — slow, tangible, and worth keeping.
          </p>
        }
        tagline="No spam. No junk. Mail people are excited to receive."
      >
        <div className="flex flex-wrap gap-3">
          <Button href={SITE.appStoreUrl} size="lg">
            Download the app
          </Button>
          <Button href="/snailmail-pro" variant="outline" size="lg">
            What is SnailMail Pro?
          </Button>
        </div>
      </LandingHero>

      <Section className="overflow-hidden border-b border-border bg-surface !py-12 sm:!py-16">
        <SectionHeading
          eyebrow="Snail pals"
          title="Every snail is unique to you!"
          description={`Mix shells, faces, accessories, and colors into a pal that's yours alone. With ${combinationLabel} possible combinations, you're unlikely to meet your snail twin.`}
        />
        <div className="mt-10 sm:mt-12">
          <SnailScrollWall />
        </div>
      </Section>

      <Section id="how-it-works" className="bg-background">
        <SectionHeading
          eyebrow="How it works"
          title="A social network that ends in the mailbox"
          description="Create square posts in the app like any social feed. We bundle them, print them, and physically mail them to the people you choose."
        />
        <div className="mt-14">
          <PhysicalMailFlow />
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Post in the app",
              body: "Share square photos, notes, and updates with friends and family — just like a normal feed.",
            },
            {
              n: "02",
              title: "We bundle & print",
              body: "Posts become a printed bundle on a regular cadence — personal, premium, and physical.",
            },
            {
              n: "03",
              title: "It arrives by mail",
              body: "The bundle lands in a real mailbox. Scan the QR to earn XP for your snail.",
            },
          ].map((s) => (
            <div
              key={s.n}
              className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 transition-shadow hover:shadow-md"
            >
              <span className="font-mono text-sm font-semibold text-brand-600">{s.n}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-surface-inverse">
        <Container className="grid items-center gap-10 py-20 lg:grid-cols-[1fr_auto] lg:gap-16">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-on-inverse sm:text-4xl lg:max-w-lg">
              Get the app. Get the good mail.
            </h2>
            <p className="mt-4 max-w-md text-lg text-on-inverse/70">
              Download Snail Mail Social and start sending posts that become real mail.
            </p>
          </div>
          <div className="flex flex-col items-center gap-8 sm:flex-row lg:flex-col xl:flex-row xl:items-end">
            <SnailArtComposite setId={HOME_SNAIL_PLACEMENTS.cta} size={160} />
            <div className="flex flex-wrap gap-3">
              <Button href={SITE.appStoreUrl} size="lg">
                Download the app
              </Button>
              <Button href="/snailmail-pro" variant="secondary" size="lg">
                SnailMail Pro
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
