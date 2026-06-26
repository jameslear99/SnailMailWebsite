# Snail Mail Social — Public Site + Advertiser Portal

The public marketing website and self-serve advertiser portal for **Snail Mail Social**,
a social app where digital posts are printed and physically mailed in bundles.
Advertisers buy targeted printed ad placements that ride inside those bundles.

This project is **separate** from the Flutter app (`SnailMailSocial/`) and the internal
`Admin/` portal, but connects to the **same Firebase backend** (`snailmail-app`) so data
is shared.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** with a centralized theme (emerald accent aligned with the Flutter app)
- **Firebase** Auth, Firestore, Storage (client SDK) + Admin SDK (server routes)
- **Stripe** for billing (charges happen only after fulfillment)

## Getting started

```bash
cp .env.example .env.local   # fill in values (a working dev config is already provided)
npm install
npm run dev                  # http://localhost:3000
```

### Environment variables

See `.env.example`. Summary:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_*` | Browser Firebase config (Auth/Firestore/Storage). On **Firebase App Hosting**, these are auto-injected via `FIREBASE_WEBAPP_CONFIG` when the backend is linked to a web app — no Secret Manager entries needed. |
| `GOOGLE_APPLICATION_CREDENTIALS` **or** `FIREBASE_SERVICE_ACCOUNT_JSON` | Server Admin SDK creds for API routes (contact form, billing, token verification). On App Hosting, `FIREBASE_CONFIG` is injected automatically. |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe. Leave blank to run the portal in "billing not configured" mode. Set via App Hosting environment variables or secrets when ready. |

The app degrades gracefully: without Admin creds the contact form returns a clear 503
(it never fakes success); without Stripe keys the billing page shows a "not connected" state.

## Scripts

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Project structure

```
src/
  app/
    (public)/        Marketing site: /, /advertisers, /pricing, /contact, /faq, /privacy, /terms
    (auth)/          /login, /signup (email-password + Google)
    dashboard/       Advertiser portal (protected): overview, campaigns, billing, team, settings, reports, onboarding
    api/             contact, billing, billing/setup-intent
  components/
    ui/              Design system primitives (Button, Card, Badge, Field, Modal, Feedback…)
    public/          Marketing layout + sections
    dashboard/       Sidebar, TopNav, MetricCard, CampaignTable, icons
    campaigns/       Wizard + steps (AdTierSelector, TargetingForm, AudienceEstimatorCard, ArtworkUpload, AdPreview, ReviewStep)
    auth/            GoogleButton
  config/            site, ad-tiers (PRICING SOURCE OF TRUTH), content-policy, targeting
  lib/               firebase/, stripe/, auth-context, validation, formatting, csv, hooks
  services/          audience, ad-tiers, advertisers, campaigns, artwork, billing
  types/             Shared data model
firebase/            firestore.rules.example, storage.rules.example
```

## Centralized configuration

- **Theme**: `src/app/globals.css` — CSS variables for colors, fonts, radius, shadows. The
  public site and portal share this design system; restyle by editing tokens here.
- **Pricing / ad tiers**: `src/config/ad-tiers.ts` is the single source of truth. Prices are in
  **USD cents**. At runtime the app prefers the `adTiers` Firestore collection (admin-managed) and
  falls back to these defaults. **Never hardcode prices elsewhere.**
- **Content policy**: `src/config/content-policy.ts` — configurable blocked-content categories.
- **Targeting guardrails**: `src/config/targeting.ts` — minimum audience threshold, minimum
  targetable age, interest/gender options.

## Firebase data model (shared collections)

`advertiserAccounts`, `advertiserUsers`, `campaigns`, `adTiers`, `contactSubmissions`, plus
admin/app-owned: `campaignCreatives`, `audienceSegments`, `campaignMetrics`, `billingEvents`,
`legalDocuments`. Types live in `src/types/index.ts`.

### Security rules

Merge `firebase/firestore.rules.example` and `firebase/storage.rules.example` into the project's
canonical rules. Assumptions:

- Advertisers can read/write only their own account + campaigns (membership is denormalized onto
  `advertiserAccounts.memberUserIds`).
- **Advertisers cannot self-approve campaigns or self-verify accounts.** `approved`/`active`/
  `completed`/`rejected` transitions and `verificationStatus` changes require an `admin` custom
  claim.
- `contactSubmissions` is written only by the server (Admin SDK) via the API route.

## Privacy & guardrails (enforced in the UI + services)

- Advertisers never see individual user data — only aggregate audience estimates.
- Minimum audience threshold blocks overly specific targeting.
- Minors cannot be targeted as a segment (age targeting starts at 18).
- Users who opt out of personalized ads are excluded from estimates.
- Every campaign requires manual review before printing; open rates are labeled estimated.

## What's intentionally stubbed (with clean seams for later)

These depend on the mobile app, admin portal, or print/fulfillment system and are implemented as
typed placeholders rather than fake behavior:

- **Audience estimation** (`services/audience.ts`) — deterministic placeholder; swap internals to
  query real user profiles without changing callers.
- **Billing / charging** (`services/billing.ts`) — Stripe customer creation, stored cards, and
  invoice listing are real (when configured). `createPostFulfillmentInvoice()` is a documented
  placeholder triggered by the future fulfillment system once actual printed quantity is known.
  We never charge upfront and never fake a charge.
- **Print-ready creative** — we store the original upload; the print-ready file URL is written by
  the fulfillment pipeline.
- **Fulfillment counts / metrics** — schema fields exist (`actualPrintedQuantity`,
  `actualMailedQuantity`, `metrics.*`) for the admin/print systems to populate.

## Admin / fulfillment boundaries

This project is advertiser-facing only. It does **not** build verification, campaign approval,
print batching, manifests, or recipient matching — but the schema is designed so the existing
`Admin/` portal and future print services can add them.
