import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Snail Mail Social collects and uses data. Placeholder pending legal review.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="Draft"
      intro="This Privacy Policy explains what data Snail Mail Social collects and how it is used across the mobile app, the public website, and the advertiser portal."
      sections={[
        {
          heading: "Data we collect",
          body: [
            "We collect account information, content you create, device information, and usage data needed to operate the service and to print and mail bundles.",
          ],
        },
        {
          heading: "Advertiser account data",
          body: [
            "For advertisers, we collect business details, contact information, billing identifiers from our payment processor, and campaign data needed to review, print, and bill campaigns.",
          ],
        },
        {
          heading: "User targeting data",
          body: [
            "Audience targeting is derived from user profile attributes such as approximate location, age, gender, and interests. Advertisers never receive individual user data — only aggregate audience estimates.",
          ],
        },
        {
          heading: "Anonymized audience estimates",
          body: [
            "Audience sizes shown to advertisers are aggregated and anonymized estimates. We enforce a minimum audience threshold so targeting cannot be used to identify specific individuals.",
          ],
        },
        {
          heading: "Ad personalization",
          body: [
            "We use profile attributes to match family-friendly ads to relevant audiences. We do not allow specific targeting of minors.",
          ],
        },
        {
          heading: "Opt-out",
          body: [
            "Users may opt out of personalized advertising. Opted-out users are excluded from personalized targeting, though they may still receive non-targeted, family-friendly ads.",
          ],
        },
        {
          heading: "Payment processing through Stripe",
          body: [
            "Advertiser payments are processed by Stripe. We do not store full card numbers; payment credentials are handled by Stripe in accordance with their terms and security standards.",
          ],
        },
        {
          heading: "Contact information",
          body: [`Questions about privacy can be sent to ${SITE.contactEmail}.`],
        },
      ]}
    />
  );
}
