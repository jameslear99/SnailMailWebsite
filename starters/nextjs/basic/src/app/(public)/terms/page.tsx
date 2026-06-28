import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the Snail Mail Social advertiser portal. Placeholder pending legal review.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="Draft"
      showDraftNotice
      intro="These Terms govern use of the Snail Mail Social advertiser portal and the creation of physical mail advertising campaigns."
      sections={[
        {
          heading: "Use of the advertiser portal",
          body: [
            "By creating an advertiser account you agree to use the portal lawfully and to provide accurate business and billing information.",
          ],
        },
        {
          heading: "Campaign approval",
          body: [
            "Every campaign is subject to manual review and must be approved before printing. Advertisers cannot self-approve campaigns. Advertiser accounts must be verified before campaigns can run.",
          ],
        },
        {
          heading: "Content restrictions",
          body: [
            "All ad creative must be family-friendly. Prohibited content includes, but is not limited to, adult, explicit, alcohol, tobacco, gambling, weapons, drugs, deceptive financial products, overtly political or inflammatory content, and misleading health or weight-loss claims.",
          ],
        },
        {
          heading: "Payment terms",
          body: [
            "Advertisers are billed only after ads are printed and sent, based on the actual quantity printed at the price for the selected ad tier. There is no upfront charge and no minimum spend.",
          ],
        },
        {
          heading: "No guarantee of exact performance",
          body: [
            "Audience sizes and open rates are estimates. Open tracking relies on optional QR scans and is not a precise measure. We make no guarantee of specific results.",
          ],
        },
        {
          heading: "Platform rights to reject or pause campaigns",
          body: [
            "We may reject, pause, or remove any campaign that violates these Terms or our content policy, at our discretion.",
          ],
        },
        {
          heading: "Family-friendly ad requirements",
          body: [
            "Because Snail Mail Social may be received by minors, all advertising must remain appropriate for a general, family-friendly audience.",
          ],
        },
      ]}
    />
  );
}
