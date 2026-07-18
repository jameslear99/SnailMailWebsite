import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/public/marketing";
import { AdvertiserWaitlistButton } from "@/components/public/advertiser-waitlist-modal";
import { Container } from "@/components/ui/Container";
import { DEFAULT_AD_TIERS, formatPrice, MAX_AD_PAGES_PER_BUNDLE } from "@/config/ad-tiers";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Simple per-printed-ad pricing across four ad tiers. No minimum spend, no minimum quantity. Pay only for ads actually printed and sent.",
};

export default function PricingPage() {
  return (
    <>
      <Section className="pb-0">
        <SectionHeading
          eyebrow="Pricing"
          title="Pay per printed ad. Nothing more."
          description="Pricing varies only by ad tier. There's no minimum spend and no minimum quantity — you're billed on the actual number of ads printed and sent."
        />
      </Section>

      <Section className="pt-12">
        <div className="grid gap-6 lg:grid-cols-4 sm:grid-cols-2">
          {DEFAULT_AD_TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">{tier.name}</h3>
                {i === 2 ? (
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
                    Popular
                  </span>
                ) : null}
              </div>
              <div className="mt-4">
                <span className="text-3xl font-semibold tracking-tight">
                  {formatPrice(tier.pricePerPrintedAd)}
                </span>
                <span className="text-sm text-muted"> / printed ad</span>
              </div>
              <p className="mt-3 flex-1 text-sm text-muted">{tier.description}</p>
              <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">Artwork</dt>
                  <dd className="font-medium">
                    {tier.dimensions.widthPx}×{tier.dimensions.heightPx}px
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Resolution</dt>
                  <dd className="font-medium">{tier.dimensions.dpi} DPI</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">Format</dt>
                  <dd className="font-medium uppercase">
                    {tier.printSpecs.allowedFileTypes.join(", ")}
                  </dd>
                </div>
              </dl>
              <AdvertiserWaitlistButton
                source="pricing"
                className="mt-6 w-full"
                variant={i === 2 ? "primary" : "outline"}
                size="md"
              >
                Notify me at launch
              </AdvertiserWaitlistButton>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 max-w-3xl rounded-[var(--radius-lg)] border border-border bg-surface p-6 text-sm text-muted">
          <p className="font-medium text-foreground">How billing works</p>
          <ul className="mt-3 space-y-2">
            <li>• You provide an estimated quantity when building a campaign — used only for a cost estimate.</li>
            <li>• Final billing is based on the actual number of ads printed and mailed.</li>
            <li>• Each mailed bundle includes up to {MAX_AD_PAGES_PER_BUNDLE} ad pages; quarter-page ads share a page.</li>
            <li>• No promo codes, no upfront charges, no refunds needed — you only pay for fulfilled quantity.</li>
          </ul>
        </div>
      </Section>

      <section className="bg-surface-inverse">
        <Container className="py-16 text-center">
          <span className="inline-flex items-center rounded-full border border-on-inverse/20 bg-on-inverse/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-on-inverse/80">
            Coming soon
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-on-inverse sm:text-3xl">
            Advertiser accounts opening soon
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-on-inverse/70">
            Preview pricing above. Join the waitlist for early access when self-serve campaigns
            launch.
          </p>
          <div className="mt-6 flex justify-center">
            <AdvertiserWaitlistButton source="pricing" size="lg" variant="secondary" />
          </div>
        </Container>
      </section>
    </>
  );
}
