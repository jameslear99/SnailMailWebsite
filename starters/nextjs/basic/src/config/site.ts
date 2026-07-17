/**
 * Centralized site metadata and navigation. Update brand-wide copy here.
 */

export const SITE = {
  name: "Snail Mail Social",
  shortName: "Snail Mail",
  tagline: "Physical social media that people actually open.",
  description:
    "Snail Mail Social turns digital posts into physical mail bundles people love to receive — and gives advertisers a smarter, trackable way to reach real audiences through print.",
  // Public contact + legal placeholders. Replace before launch.
  contactEmail: "hello@snailmail.social",
  advertiserEmail: "advertisers@snailmail.social",
  supportEmail: "support@snailmail.social",
  // App store placeholders (assets/links to be added later).
  appStoreUrl: "#",
  playStoreUrl: "#",
  company: "Snail Mail Social, Inc.",
} as const;

export const PUBLIC_NAV = [
  { label: "For Advertisers", href: "/advertisers" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_NAV = {
  Product: [
    { label: "How it works", href: "/#how-it-works" },
    { label: "SnailMail Pro", href: "/snailmail-pro" },
    { label: "For advertisers", href: "/advertisers" },
    { label: "Pricing", href: "/pricing" },
  ],
  Company: [
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  Advertisers: [
    { label: "Log in", href: "/login" },
    { label: "Create account", href: "/signup" },
  ],
} as const;

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "grid" },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: "megaphone" },
  { label: "Reports", href: "/dashboard/reports", icon: "chart" },
  { label: "Billing", href: "/dashboard/billing", icon: "card" },
  { label: "Team", href: "/dashboard/team", icon: "users" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
] as const;
