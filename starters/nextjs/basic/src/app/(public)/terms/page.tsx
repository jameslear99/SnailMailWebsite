import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms for using Snail Mail Social — the mobile app, SnailMail Pro, and the advertiser platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="July 17, 2026"
      intro={`These Terms of Service ("Terms") govern your use of ${SITE.name} — including the mobile app, SnailMail Pro subscription, this website, and (when available) the advertiser portal — operated by ${SITE.company}. By using Snail Mail Social you agree to these Terms.`}
      sections={[
        {
          heading: "Who may use Snail Mail Social",
          body: [
            "You must be at least 13 years old to create an account. If you are under 18, you represent that you have permission from a parent or legal guardian.",
            "You agree to provide accurate account information and to keep your login credentials secure. You are responsible for activity under your account.",
          ],
        },
        {
          heading: "The mobile app and SnailMail Pro",
          body: [
            "Snail Mail Social lets you create digital posts, connect with friends, collect a virtual snail pal, and (with SnailMail Pro) receive selected friend posts as physical mail at the mailing address you provide.",
            "SnailMail Pro is an optional subscription purchased through the Apple App Store or Google Play (processed by RevenueCat). Subscription terms, pricing, renewal, and cancellation are governed by the applicable app store and the in-app purchase flow. Physical mail delivery depends on a valid mailing address and our print and mail partners.",
            "Your mailing address is used only to fulfill physical mail you request or receive through SnailMail Pro. Friends and other users do not see your mailing address.",
          ],
        },
        {
          heading: "Your content and conduct",
          body: [
            "You retain ownership of content you create, but grant Snail Mail Social a license to host, display, process, print, and deliver that content as needed to operate the service — including printing posts for physical delivery and showing posts to recipients you choose.",
            "You agree not to post unlawful, harassing, hateful, sexually explicit, deceptive, or otherwise harmful content. We may remove content or suspend accounts that violate these Terms or harm other users or the service.",
            "You may not scrape, reverse engineer, or misuse the service; impersonate others; or attempt to access accounts or data you are not authorized to access.",
          ],
        },
        {
          heading: "Physical mail and fulfillment",
          body: [
            "Physical mail is produced and sent by third-party print and mail partners on our behalf. Delivery times are estimates and may vary by carrier, address, and operational factors outside our control.",
            "You are responsible for keeping your mailing address current. Undeliverable mail caused by an incorrect address may not be re-sent at our expense.",
          ],
        },
        {
          heading: "Advertising in mail bundles",
          body: [
            "Snail Mail Social may include family-friendly printed advertisements inside physical mail bundles. Ads are reviewed before printing. Users may opt out of personalized advertising where that setting is offered in the app.",
            "Advertisers never receive individual user data; targeting uses anonymized, aggregated audience estimates.",
          ],
        },
        {
          heading: "Advertiser portal (when available)",
          body: [
            "If you create an advertiser account, additional terms apply to campaign creation, billing, and content standards.",
            "Every campaign is subject to manual review and must be approved before printing. Advertiser accounts may require verification before campaigns run.",
            "All ad creative must be family-friendly. Prohibited content includes, but is not limited to, adult or explicit material, alcohol, tobacco, gambling, weapons, illegal drugs, deceptive financial products, overtly political or inflammatory content, and misleading health or weight-loss claims.",
            "Advertisers are billed only after ads are printed and sent, based on the actual quantity printed at the price for the selected ad tier. There is no upfront charge and no minimum spend unless otherwise stated at checkout.",
            "Audience sizes and open rates are estimates. Open tracking relies on optional QR scans and is not a precise measure. We do not guarantee specific campaign results.",
            "We may reject, pause, or remove any campaign that violates these Terms or our content policy.",
          ],
        },
        {
          heading: "Payments",
          body: [
            "Consumer subscriptions are handled by Apple or Google through in-app purchase. Advertiser payments, when available, are processed by Stripe. We do not store full payment card numbers.",
            "Refunds for app subscriptions follow the policies of the app store through which you purchased. Advertiser billing disputes should be sent to " +
              SITE.advertiserEmail +
              ".",
          ],
        },
        {
          heading: "Disclaimers and limitation of liability",
          body: [
            'Snail Mail Social is provided "as is" to the fullest extent permitted by law. We do not warrant uninterrupted or error-free operation.',
            "To the maximum extent permitted by law, Snail Mail Social and its affiliates are not liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits or data, arising from your use of the service.",
            "Our total liability for any claim relating to the service is limited to the greater of (a) amounts you paid us in the twelve months before the claim or (b) one hundred U.S. dollars (USD $100), except where applicable law requires otherwise.",
          ],
        },
        {
          heading: "Termination",
          body: [
            "You may stop using Snail Mail Social at any time and may delete your account in the app or by contacting us.",
            "We may suspend or terminate access if you violate these Terms, create risk for other users, or as required to comply with law.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "We may update these Terms from time to time. If we make material changes, we will post the updated Terms on this page and update the “Last updated” date. Continued use after changes become effective constitutes acceptance.",
          ],
        },
        {
          heading: "Contact",
          body: [
            `General: ${SITE.contactEmail}`,
            `Support: ${SITE.supportEmail}`,
            `Advertisers: ${SITE.advertiserEmail}`,
          ],
        },
      ]}
    />
  );
}
