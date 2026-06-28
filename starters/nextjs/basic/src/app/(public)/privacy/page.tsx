import type { Metadata } from "next";
import { LegalPage } from "@/components/public/LegalPage";
import { SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Snail Mail Social collects, uses, stores, and protects your information — including data received from Google Sign-In.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="June 28, 2026"
      intro={`This Privacy Policy describes how ${SITE.company} ("Snail Mail Social," "we," "us," or "our") collects, uses, stores, shares, and protects information when you use the Snail Mail Social mobile app, this website (${SITE.name}), and the advertiser portal. It includes specific disclosures about data we receive from Google when you choose to sign in with Google.`}
      sections={[
        {
          heading: "Who we are",
          body: [
            `${SITE.company} operates Snail Mail Social, a service that turns digital posts into physical mail bundles and offers family-friendly printed advertising to advertisers.`,
            `This policy applies to all Snail Mail Social products. Questions about privacy can be sent to ${SITE.contactEmail}.`,
          ],
        },
        {
          heading: "Information we collect",
          body: [
            "Depending on how you use Snail Mail Social, we may collect:",
            "Account and profile information you provide (such as name, username, email address, date of birth, profile photo, bio, and mailing address).",
            "Content you create in the app (posts, messages, photos, and preferences).",
            "Device and usage information needed to operate, secure, and improve the service (such as device type, app version, and general usage events).",
            "Advertiser business details, campaign data, and billing identifiers when you use the advertiser portal.",
          ],
        },
        {
          heading: "Google user data we collect",
          body: [
            "If you choose Sign in with Google in the Snail Mail Social mobile app or advertiser portal, we receive limited information from Google through Google OAuth and Firebase Authentication. This may include:",
            "Your Google account email address.",
            "Your Google account display name.",
            "Your Google profile photo URL.",
            "A unique Google account identifier used to authenticate you and link your Snail Mail Social account.",
            "We do not receive your Google account password. We request only the scopes needed to authenticate you and create or sign in to your Snail Mail Social account.",
            "In the mobile app, when you use address autocomplete, your typed address search text may be sent to the Google Places API to suggest mailing addresses. Google may process those queries under its own terms and privacy policy; we use the selected address details you confirm to fulfill physical mail delivery.",
          ],
        },
        {
          heading: "How we use Google user data",
          body: [
            "We use Google user data only to provide and improve Snail Mail Social features you request, including:",
            "Creating and signing in to your Snail Mail Social account.",
            "Displaying your name and profile photo in your account and, where you choose, on your public profile.",
            "Associating your account with the content, friends, mail bundles, and settings you create in the app.",
            "Operating the advertiser portal when you sign in with Google, including account access, team membership, and campaign management.",
            "Protecting the security and integrity of our service (for example, preventing fraud and unauthorized access).",
            "Communicating with you about your account, support requests, and important service updates.",
            "We do not use Google user data for targeted advertising, retargeted advertising, interest-based advertising, personalized advertising, selling to data brokers, creditworthiness determination, lending, or training AI or machine-learning models unrelated to providing Snail Mail Social.",
          ],
        },
        {
          heading: "How we share, transfer, or disclose Google user data",
          body: [
            "We do not sell Google user data.",
            "We may share Google user data only with service providers that help us operate Snail Mail Social, and only as needed to provide or improve the service:",
            "Google Firebase (authentication, database, storage, and hosting infrastructure) to authenticate users and store account data securely.",
            "Print and mail fulfillment partners, only to the extent necessary to print and deliver physical mail you request. We do not share your Google sign-in credentials with fulfillment partners.",
            "Payment processors such as Stripe for advertiser billing. Stripe receives billing and business information for advertiser accounts, not Google OAuth tokens or Google profile data used for consumer sign-in.",
            "Law enforcement or other parties when required by law, to protect rights and safety, or to respond to valid legal process.",
            "We do not transfer or disclose Google user data to third parties for their independent advertising, marketing, or data-broker purposes.",
          ],
        },
        {
          heading: "How we protect your information",
          body: [
            "We use administrative, technical, and organizational safeguards designed to protect personal information, including Google user data, against unauthorized access, loss, misuse, or alteration.",
            "Data is transmitted over encrypted connections (HTTPS/TLS). Account data is stored using Firebase and Google Cloud infrastructure with access controls limited to authorized personnel and systems.",
            "OAuth tokens and authentication credentials are handled through Firebase Authentication; we do not store your Google password.",
            "No method of transmission or storage is completely secure. If you believe your account has been compromised, contact us at " +
              SITE.supportEmail +
              ".",
          ],
        },
        {
          heading: "Data retention and deletion",
          body: [
            "We retain personal information, including Google user data, for as long as your account is active and as needed to provide Snail Mail Social, comply with legal obligations, resolve disputes, and enforce our agreements.",
            "When you delete your Snail Mail Social account, we delete or anonymize your personal information within a reasonable period, except where retention is required by law or needed for legitimate business purposes such as fraud prevention, billing records, or security logs.",
            "You may request access to, correction of, or deletion of your personal information by contacting " +
              SITE.contactEmail +
              ". We may need to verify your identity before fulfilling a request.",
            "If you signed in with Google, you can also revoke Snail Mail Social's access to your Google account at any time through your Google Account permissions settings at https://myaccount.google.com/permissions.",
          ],
        },
        {
          heading: "Advertiser account data",
          body: [
            "For advertisers, we collect business details, contact information, billing identifiers from our payment processor, and campaign data needed to review, print, and bill campaigns.",
            "Advertiser Google sign-in data is used only to authenticate advertiser portal access and manage advertiser accounts, not for consumer ad targeting.",
          ],
        },
        {
          heading: "User targeting and advertising",
          body: [
            "Audience targeting for printed ads is derived from Snail Mail Social user profile attributes such as approximate location, age, gender, and interests — not from Google sign-in data.",
            "Advertisers never receive individual user data; they see only aggregated, anonymized audience estimates. We enforce a minimum audience threshold so targeting cannot be used to identify specific individuals.",
            "We use profile attributes to match family-friendly ads to relevant audiences. We do not allow specific targeting of minors.",
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
          heading: "Children",
          body: [
            "Snail Mail Social requires users to be at least 13 years old to create an account. We do not knowingly collect personal information from children under 13. If you believe a child under 13 has provided us information, contact us at " +
              SITE.contactEmail +
              ".",
          ],
        },
        {
          heading: "Changes to this policy",
          body: [
            "We may update this Privacy Policy from time to time. If we change how Snail Mail Social uses Google user data, we will update this page and, where appropriate, notify you in the app or by email.",
            "The “Last updated” date at the top of this page shows when this policy was most recently revised.",
          ],
        },
        {
          heading: "Contact us",
          body: [
            `Privacy questions or requests: ${SITE.contactEmail}`,
            `Support: ${SITE.supportEmail}`,
            `Advertiser inquiries: ${SITE.advertiserEmail}`,
          ],
        },
      ]}
    />
  );
}
