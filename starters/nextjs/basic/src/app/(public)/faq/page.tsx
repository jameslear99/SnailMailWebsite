import type { Metadata } from "next";
import { Section, SectionHeading } from "@/components/public/marketing";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about Snail Mail Social, physical posts, advertising, targeting, and open tracking.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Snail Mail Social?",
    a: "Snail Mail Social is a social network where digital posts are collected, printed, and physically mailed to the people you choose. It blends the ease of a social feed with the delight of receiving real mail.",
  },
  {
    q: "How do physical posts work?",
    a: "You create posts in the app like any social feed. On a regular cadence, your posts are bundled together, printed, and mailed as a physical bundle to recipients.",
  },
  {
    q: "How does advertising work?",
    a: "Advertisers upload finished ad artwork and choose a target audience. Approved ads are printed and included inside mail bundles. Advertisers are billed based on the actual number of ads printed and sent.",
  },
  {
    q: "Are ads targeted?",
    a: "Yes. Advertisers can target by location, age, gender, and interests using anonymized, aggregated audience data. Advertisers never see individual user information.",
  },
  {
    q: "Can users opt out of personalized ads?",
    a: "Yes. Users who opt out of personalized advertising are excluded from personalized targeting. They may still receive family-friendly ads, but not as part of a targeted segment.",
  },
  {
    q: "How are advertisers charged?",
    a: "Advertisers are charged only after ads are actually printed and sent, based on the real quantity and the price for the selected ad tier. There is no upfront charge and no minimum spend.",
  },
  {
    q: "How does open tracking work?",
    a: "Each bundle includes a page where recipients can scan a QR code to earn in-app XP for their snail. That scan indicates the bundle was opened and is used to estimate open rates.",
  },
  {
    q: "Why is open tracking estimated and not perfect?",
    a: "Not every recipient will scan the QR code, so open tracking captures a sample rather than every open. We clearly label all open metrics as estimates.",
  },
  {
    q: "What kinds of ads are allowed?",
    a: "Only family-friendly ads. We do not allow adult, explicit, alcohol, tobacco, gambling, weapons, drug, deceptive financial, overtly political, or misleading health content, among others.",
  },
  {
    q: "How does advertiser approval work?",
    a: "Anyone can create an advertiser account, but campaigns can't run until the advertiser is verified and the specific campaign is manually approved by our team before printing.",
  },
];

export default function FaqPage() {
  return (
    <Section>
      <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />
      <div className="mx-auto mt-12 max-w-3xl divide-y divide-border rounded-[var(--radius-lg)] border border-border bg-surface">
        {FAQS.map((item) => (
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
  );
}
