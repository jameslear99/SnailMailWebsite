Master Prompt for Coding Agent: Build Snail Mail Social Public Site + Advertiser Portal

You are building the public-facing website and advertiser portal for Snail Mail Social, a social media app where users create digital posts that are eventually printed and physically mailed in bundles. This website has two main purposes:

Public marketing site for Snail Mail Social.
Self-serve advertiser portal where businesses can create, manage, and track physical ad campaigns that are printed and included in mailed bundles.

This project should be built with a long-term scalable architecture from the beginning, even if some backend pieces are not yet fully connected. Build the codebase cleanly, modularly, and in a way that can connect to the main Snail Mail Social app and future admin portal through Firebase.

Core Product Concept

Snail Mail Social is a social media app where users send physical mail-style social posts. Advertisers can purchase targeted printed ad placements that are included in mailed bundles. Unlike traditional junk mail, Snail Mail Social advertising is:

More targeted.
More engaging.
More trackable.
Included naturally inside social mail bundles users are excited to receive.
Capable of measuring bundle opens through optional user QR scans that reward in-app XP.

The advertiser portal should feel like a simpler, cleaner version of Meta Ads Manager, but for physical mail advertising.

The tone should be serious, premium, tech-forward, and effective. Avoid making the advertiser portal feel childish or overly cute. The broader brand can have snail-themed elements later, but the current build should use a modern, professional design system that can be restyled easily.

Recommended Tech Stack

Use:

Next.js
TypeScript
Firebase Auth
Firestore
Firebase Storage
Stripe
Tailwind CSS
Component-based UI architecture

The project should be desktop-first, but still responsive and usable on mobile.

Authentication should support:

Email/password login
Google sign-in

Only advertisers and internal admins log into this website. Regular app users do not log into this website.

Public Site Pages

Build the following public pages:

1. Home / Landing Page

Primary goals:

Explain Snail Mail Social.
Drive app downloads.
Attract advertisers.
Communicate the uniqueness of physical social media.
Communicate that Snail Mail Social ads are a smarter form of printed advertising.

Sections should include:

Hero section.
Simple explanation of the app.
“Why physical social media?” section.
“For advertisers” section.
CTA for app downloads.
CTA for advertisers to create an account.
Placeholder areas for future app screenshots/mockups.
Placeholder areas for future snail animations/art.

Do not include fake screenshots or fake art yet. Use clean placeholder cards/blocks where those assets will eventually go.

2. For Advertisers

Explain the advertiser value proposition:

Target physical ads by real user audiences.
Reach people in a high-attention physical mail experience.
Pay based on actual ads printed/sent.
Track campaign performance.
Measure bundle opens through Snail Mail Social’s scan-for-XP system.
Optionally use advertiser-provided QR codes or tracking URLs.

This page should position Snail Mail Social as a modern alternative to traditional print advertising and junk mail.

3. Pricing

Show ad product tiers:

Quarter-page ad
Half-page ad
Full-page one-sided ad
Full-page front-and-back ad

Pricing is based on cost per printed ad, and price varies only by ad tier.

The actual cost values should be configurable in the database or a centralized config file.

There should be no minimum spend and no minimum quantity for now.

4. Contact

Simple contact form for:

General questions
Advertiser questions
Support
Partnership inquiries

Store submissions in Firestore.

5. FAQ

Include FAQs for:

What Snail Mail Social is.
How physical posts work.
How advertising works.
Whether ads are targeted.
Whether users can opt out of personalized ads.
How advertisers are charged.
How open tracking works.
Why open tracking is estimated and not perfect.
What kinds of ads are allowed.
How advertiser approval works.
6. Privacy Policy

Create a placeholder privacy page that makes clear this needs final legal review. Include sections for:

Data collected.
Advertiser account data.
User targeting data.
Anonymized audience estimates.
Ad personalization.
Opt-out.
Payment processing through Stripe.
Contact information.
7. Terms

Create a placeholder terms page that makes clear this needs final legal review. Include sections for:

Use of advertiser portal.
Campaign approval.
Content restrictions.
Payment terms.
No guarantee of exact performance.
Platform rights to reject or pause campaigns.
Family-friendly ad requirements.
Advertiser Portal

The advertiser portal should be a self-serve ad platform.

Advertisers can:

Create an account.
Create or manage a business profile.
Create campaigns.
Select audience targeting.
Upload finished ad artwork.
Preview ad placement.
Store payment methods through Stripe.
View campaign status.
View campaign metrics.
Export campaign reports.
Duplicate past campaigns.
Save drafts.

Advertisers should not see individual user data. All audience data must be anonymized and aggregated.

Advertiser Account Model

When an advertiser signs up, collect:

Business name
Contact person name
Contact email
Contact phone
Business website
Business address
Industry/category
Optional logo
Billing/customer ID from Stripe
Verification status

Possible advertiser verification statuses:

pending
verified
rejected
suspended

Anyone can create an advertiser account, but campaigns should not be allowed to run until the advertiser is verified.

Support multiple team members per business account if possible.

Suggested roles:

owner
admin
marketer
viewer
Campaign Creation Flow

Build a guided campaign creation wizard.

Campaign creation steps:

Step 1: Campaign Basics

Fields:

Campaign name
Business/account selection
Campaign goal
Start date
End date
Evergreen toggle

Evergreen campaigns should continue running until paused, expired, or budget/quantity is exhausted.

Step 2: Choose Ad Tier

Available ad tiers:

Quarter-page ad
Half-page ad
Full-page one-sided ad
Full-page front-and-back ad

Each tier should define:

Placement size
Required artwork dimensions
File format requirements
Price per printed ad
Preview template
Print-safe area
Bleed/margin rules
Step 3: Audience Targeting

Advertisers can target by:

Location
Gender
Age
Interests

Location targeting should support:

City
ZIP code
Radius targeting

The audience data will come from user profiles in the main Snail Mail Social app.

Rules:

Show estimated audience size.
Do not expose individual users.
Enforce a minimum audience threshold to prevent overly specific targeting.
Block sensitive targeting.
Do not allow advertisers to specifically target minors.
Minors may still receive family-friendly ads, but they cannot be targeted as a specific audience segment.
Users who opt out of personalized ads should not be included in personalized targeting.
Step 4: Quantity / Budget / Schedule

Advertisers should be able to choose:

Desired number of printed ads
Estimated campaign budget
Campaign duration
Specific send dates if applicable

Billing is ultimately based on actual quantity printed/sent, not the estimate.

Show clear estimated cost, but label it as an estimate.

Step 5: Upload Artwork

Advertisers upload finished artwork only.

Do not build an ad designer.

Initial preferred upload format:

PNG

Structure code so other file formats can be added later, such as:

JPG
PDF
SVG

Artwork validation should include:

Correct dimensions for selected ad tier
Minimum resolution
File type
File size
Print-safe margins
Bleed requirements
Orientation/layout compatibility

Store both:

Original uploaded file
Print-ready processed version

Use Firebase Storage.

The campaign record in Firestore should store file URLs, metadata, validation status, and print-readiness status.

Step 6: Preview

Advertisers should see a preview of:

Their ad by itself.
Their ad inside a sample mail bundle.
Their ad placement based on selected tier.

Important bundle rule:

Each mailed bundle can include up to 4 ad pages.

If all ad slots are quarter-page placements, one bundle could theoretically contain up to 32 advertisers because each ad page can hold eight quarter-page ads.

The preview does not need to assign real bundle placement yet. It only needs to show how the selected ad tier might appear in the physical bundle.

Step 7: Review and Submit

Show:

Campaign settings
Target audience summary
Estimated audience size
Selected ad tier
Estimated quantity
Estimated cost
Uploaded creative preview
Compliance reminders

Campaigns require manual approval before printing.

Campaign statuses should include:

draft
submitted
pending_advertiser_verification
pending_review
approved
active
paused
completed
rejected
cancelled
Payment and Billing

Use Stripe.

Advertisers should be able to:

Add a payment method.
Store payment methods.
View invoices/receipts.
View billing history.

Billing rule:

Advertisers are charged after ads are actually printed/sent, based on the actual number of ads printed for that campaign.

Do not charge upfront based on estimated quantity.

Each campaign should track:

Estimated quantity
Actual printed quantity
Actual mailed quantity
Price per printed ad
Total amount due
Stripe invoice/payment status

No promo codes are needed now.

No refunds/credits are needed because advertisers are only charged based on actual fulfilled quantity.

Campaign Tracking

Advertisers should see campaign-level metrics.

Launch metrics:

Ads printed
Ads mailed
Open rate
Estimated opens
QR scans, if enabled
Campaign status
Spend to date
Cost per open estimate
Date range
Audience summary

Open tracking logic:

Snail Mail Social will include a page in the physical bundle where users can scan a QR code to get XP for their snail. That scan indicates the bundle was opened. This is used to estimate open rate.

Important: not every user will scan, so open tracking is not perfectly accurate. The UI should clearly label open metrics as estimated.

Ad-specific QR codes:

Advertisers can include their own QR code in their uploaded artwork.

Eventually, the platform may optionally generate campaign tracking QR codes, but this should only happen if requested. Build the data model so this can be added later.

Tracking should be per campaign, not per individual recipient.

Advertisers should be able to export reports as:

CSV
PDF, if reasonable

CSV is more important for the first build.

Admin Portal Boundaries

Do not build the full admin portal in this project.

However, structure the data so a separate future admin portal can:

Verify advertisers.
Approve/reject campaigns.
Review ad creative.
Pause campaigns.
Blacklist advertisers/categories.
Manage ad tiers.
Manage pricing.
Connect campaigns to print batches.
Mark ads as printed/mailed.
Generate manifests.
Manage fulfillment.

This project should include only the advertiser-facing side and public site.

If small internal-only fields or status placeholders are needed to support future admin workflows, include them in the Firestore schema.

Fulfillment and Printing Boundaries

Fulfillment is manual/in-house.

Do not build the full print/fulfillment system in this project.

However, this project must store all campaign and creative data in a way that future print services can use correctly.

Store:

Campaign details
Audience targeting
Approved ad creative
Print-ready file URL
Ad tier
Pricing
Campaign status
Fulfillment counts
Printed quantity
Mailed quantity
Open tracking metrics

Do not build:

Dynamic ad selection for bundles
Batch manifest generation
Print queue
Recipient matching
Physical mail fulfillment workflow
Inventory reservation logic

But design the schema so these can be added later.

If there are not enough matching users for a targeting setup, the campaign creation flow should show a warning or show the estimated available audience size.

Firebase / Data Architecture

This website should connect to the same Firebase backend as:

Main Snail Mail Social app
Advertiser portal
Future admin portal

Use shared collections where appropriate.

Suggested Firestore collections:

advertiserAccounts
advertiserUsers
campaigns
campaignCreatives
adTiers
audienceSegments
campaignMetrics
billingEvents
contactSubmissions
legalDocuments

Suggested campaign object:

type Campaign = {
  id: string;
  advertiserAccountId: string;
  createdByUserId: string;

  name: string;
  goal?: string;

  status:
    | "draft"
    | "submitted"
    | "pending_advertiser_verification"
    | "pending_review"
    | "approved"
    | "active"
    | "paused"
    | "completed"
    | "rejected"
    | "cancelled";

  adTierId: string;

  targeting: {
    locations?: {
      cities?: string[];
      zipCodes?: string[];
      radiusTargets?: {
        centerZipCode: string;
        radiusMiles: number;
      }[];
    };
    gender?: string[];
    ageRange?: {
      min?: number;
      max?: number;
    };
    interests?: string[];
  };

  estimatedAudienceSize?: number;
  minimumAudienceThresholdPassed?: boolean;

  schedule: {
    startDate?: Timestamp;
    endDate?: Timestamp;
    evergreen: boolean;
    requestedSendDates?: Timestamp[];
  };

  quantity: {
    desiredQuantity?: number;
    estimatedQuantity?: number;
    actualPrintedQuantity?: number;
    actualMailedQuantity?: number;
  };

  pricing: {
    pricePerPrintedAd: number;
    estimatedCost?: number;
    actualCost?: number;
    currency: "usd";
  };

  creative: {
    originalFileUrl?: string;
    printReadyFileUrl?: string;
    fileType?: string;
    widthPx?: number;
    heightPx?: number;
    validationStatus?: "pending" | "valid" | "invalid";
    validationErrors?: string[];
  };

  metrics: {
    estimatedOpens?: number;
    bundleScans?: number;
    estimatedOpenRate?: number;
    advertiserQrScans?: number;
  };

  billing: {
    stripeCustomerId?: string;
    stripeInvoiceId?: string;
    stripePaymentIntentId?: string;
    billingStatus?: "not_ready" | "pending" | "invoiced" | "paid" | "failed";
  };

  review: {
    submittedAt?: Timestamp;
    reviewedAt?: Timestamp;
    reviewedBy?: string;
    rejectionReason?: string;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
};

Suggested ad tier object:

type AdTier = {
  id: string;
  name: "Quarter Page" | "Half Page" | "Full Page One Side" | "Full Page Front and Back";
  description: string;
  pricePerPrintedAd: number;
  dimensions: {
    widthPx: number;
    heightPx: number;
    dpi: number;
  };
  printSpecs: {
    bleedInches: number;
    safeMarginInches: number;
    allowedFileTypes: string[];
    maxFileSizeMb: number;
  };
  active: boolean;
  sortOrder: number;
};
Privacy and Targeting Guardrails

Build with privacy-first rules.

Requirements:

Never show advertisers individual user data.
Only show aggregate audience estimates.
Enforce minimum audience size thresholds.
Do not allow sensitive targeting.
Do not allow specific targeting of minors.
Respect user opt-outs from personalized advertising.
Store campaign targeting in a clear, auditable structure.
Add clear disclaimers that open rates are estimated.
Require manual approval for every campaign before printing.

Blocked ad content should include anything not family-friendly, including but not limited to:

Adult content
Explicit content
Alcohol
Tobacco/nicotine
Gambling
Weapons
Drugs
Deceptive financial products
Overtly political or inflammatory content
Misleading health or weight-loss claims
Anything inappropriate for a platform that may include minors

Make these content policy categories configurable so they can evolve later.

Design Requirements

The site should feel:

Premium
Tech-forward
Clean
Serious to advertisers
Modern
Trustworthy
Easy to use

Advertiser portal inspiration:

Meta Ads Manager, but much simpler.
Stripe dashboard.
Modern SaaS analytics dashboards.

Do not overuse snail theming in the advertiser portal.

Use a centralized theme system so colors, fonts, spacing, border radius, shadows, and component styles can be changed quickly later.

The landing page and advertiser portal should share a design system.

UI Structure

Public site routes:

/
/advertisers
/pricing
/contact
/faq
/privacy
/terms
/login
/signup

Advertiser portal routes:

/dashboard
/dashboard/campaigns
/dashboard/campaigns/new
/dashboard/campaigns/[campaignId]
/dashboard/campaigns/[campaignId]/edit
/dashboard/billing
/dashboard/settings
/dashboard/team
/dashboard/reports

Dashboard should include:

Campaign overview cards
Active campaigns
Draft campaigns
Pending review campaigns
Completed campaigns
Spend summary
Printed/mailed count summary
Estimated open rate summary
Component Requirements

Create reusable components for:

Public site layout
Dashboard layout
Sidebar navigation
Top nav
Campaign status badges
Metric cards
Campaign table
Campaign creation wizard
Ad tier selector
Audience targeting form
Audience size estimator card
Artwork upload component
Artwork validation display
Ad preview card
Billing/payment method card
Empty states
Loading states
Error states
Confirmation modals
Campaign Management Features

Advertisers should be able to:

View all campaigns.
Filter campaigns by status.
Search campaigns by name.
Create new campaigns.
Save drafts.
Edit drafts.
Submit campaigns for review.
Duplicate campaigns.
View campaign details.
View campaign metrics.
Export campaign data as CSV.
Pause active campaigns if allowed.
See why campaigns were rejected.

Do not allow advertisers to self-approve campaigns.

Audience Estimation

Create a service layer for estimating audience size.

For now, it can use mock or placeholder logic if the live app user data is not ready.

However, structure it so it can later query Firestore user profile data.

Audience estimator should return:

type AudienceEstimate = {
  estimatedAudienceSize: number;
  minimumThresholdPassed: boolean;
  warnings: string[];
};

Warnings may include:

Audience is too small.
Targeting includes restricted age range.
Radius target has limited coverage.
User opt-outs may reduce actual delivery.
Estimated audience size may change before fulfillment.
Artwork Upload and Print Readiness

The artwork upload system should:

Upload to Firebase Storage.
Validate dimensions.
Validate file type.
Validate file size.
Display errors clearly.
Store metadata in Firestore.
Prepare a print-ready file record.

Do not create a Canva-style editor.

Do not allow campaigns to be submitted unless artwork passes validation.

Stripe Integration

Build Stripe integration for:

Customer creation
Stored payment methods
Billing history
Invoice display if possible
Future post-fulfillment charging

The actual charge should happen only after ads are printed/sent. If the printing system is not implemented yet, create the billing data model and placeholder service methods for future charging.

Do not fake successful charges.

Reports

Campaign reports should show:

Campaign name
Status
Ad tier
Start/end date
Printed quantity
Mailed quantity
Estimated opens
Estimated open rate
Spend
Cost per estimated open

Support CSV export.

Development Standards

Use:

TypeScript everywhere.
Strong types for campaign, advertiser, billing, creative, and metrics data.
Clear service layer separation.
Clean folder structure.
Reusable components.
Centralized constants/config.
Centralized theme.
Firebase security rules assumptions documented.
Environment variable examples.
Loading/error states.
Form validation.
Good empty states.
Accessible UI.
Responsive layout.

Avoid:

Hardcoded pricing scattered throughout the app.
Exposing individual app user data.
Building admin workflows inside this project.
Building print fulfillment workflows inside this project.
Building ad design tools.
Making the advertiser portal feel overly cute or gimmicky.
Deliverables

Build the project with:

Public marketing site.
Advertiser authentication.
Advertiser onboarding/business profile.
Advertiser dashboard.
Campaign creation wizard.
Audience targeting form.
Audience size estimate placeholder service.
Artwork upload and validation.
Campaign preview.
Campaign submission flow.
Campaign detail page.
Campaign metrics dashboard.
Billing/payment method structure using Stripe.
CSV report export.
Contact form.
FAQ, Privacy, Terms pages.
Scalable Firebase data model.
Clean design system.
Clear comments where future admin/fulfillment integrations will connect.
Important Final Instruction

Build this as a real long-term product foundation, not a disposable landing page. The public site should help users and advertisers understand Snail Mail Social, while the advertiser portal should be a serious, self-serve ad platform for targeted physical mail campaigns.

When something depends on the future mobile app, admin portal, or print fulfillment system, create clean placeholder service methods and data structures rather than hardcoding fake behavior into the UI.