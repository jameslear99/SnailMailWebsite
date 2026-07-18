/**
 * Published snail art layers downloaded from Firestore.
 * Marketing pages only use set numbers >= MIN_MARKETING_SNAIL_SET.
 */

export const SNAIL_LAYER_ORDER = [
  "antenna",
  "body",
  "shell",
  "face",
  "accessory",
] as const;

/** Never feature snail sets 1–3 on the marketing site. */
export const MIN_MARKETING_SNAIL_SET = 4;

export const SNAIL_SET_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
] as const;

export type SnailArtSetId = (typeof SNAIL_SET_IDS)[number];
export type SnailArtLayer = (typeof SNAIL_LAYER_ORDER)[number];

/** Hero slideshow cycles sets 5–21 (inclusive). */
export const HERO_SNAIL_SLIDE_START = 5;
export const HERO_SNAIL_SLIDE_END = 21;

/** First snail shown in the hero slideshow (cycles through the pool from here). */
export const HERO_SNAIL_INITIAL_SET = 18 as SnailArtSetId;

/** Excluded from the hero slideshow (broken layers or art we don't want featured). */
export const HERO_SNAIL_EXCLUDED_SETS: SnailArtSetId[] = [5];

/** Sets used for marketing random generation and hero slideshow. */
export const MARKETING_SNAIL_POOL = Array.from(
  { length: HERO_SNAIL_SLIDE_END - HERO_SNAIL_SLIDE_START + 1 },
  (_, i) => (i + HERO_SNAIL_SLIDE_START) as SnailArtSetId,
);

/** Independently rolled layer set IDs (mirrors in-app random looks). */
export type RandomSnailLook = Partial<Record<SnailArtLayer, SnailArtSetId>>;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateRandomSnailLook(seed: number): RandomSnailLook {
  const rand = mulberry32(seed);
  const pick = () =>
    MARKETING_SNAIL_POOL[Math.floor(rand() * MARKETING_SNAIL_POOL.length)]!;

  const look: RandomSnailLook = {
    antenna: pick(),
    body: pick(),
    shell: pick(),
    face: pick(),
  };

  if (rand() > 0.28) {
    look.accessory = pick();
  }

  return look;
}

export function generateSnailScrollRows({
  rowCount = 4,
  snailsPerRow = 36,
  seed = 20260717,
}: {
  rowCount?: number;
  snailsPerRow?: number;
  seed?: number;
} = {}): RandomSnailLook[][] {
  const rand = mulberry32(seed);
  return Array.from({ length: rowCount }, (_, row) =>
    Array.from({ length: snailsPerRow }, () => {
      const lookSeed = Math.floor(rand() * 2_147_483_647);
      return generateRandomSnailLook(lookSeed + row * 997);
    }),
  );
}

function setPaths(n: SnailArtSetId): Partial<Record<SnailArtLayer, string>> {
  const base = `/marketing/snail-art/set-${n}`;
  return {
    antenna: `${base}-antenna.png`,
    body: `${base}-body.png`,
    shell: `${base}-shell.png`,
    face: `${base}-face.png`,
    accessory: `${base}-accessory.png`,
  };
}

export const SNAIL_ART_SETS = Object.fromEntries(
  SNAIL_SET_IDS.map((id) => [id, setPaths(id)]),
) as Record<SnailArtSetId, Partial<Record<SnailArtLayer, string>>>;

export const HERO_SNAIL_SLIDESHOW = (() => {
  const pool = MARKETING_SNAIL_POOL.filter((id) => !HERO_SNAIL_EXCLUDED_SETS.includes(id));
  const startIdx = pool.indexOf(HERO_SNAIL_INITIAL_SET);
  if (startIdx <= 0) return pool;
  return [...pool.slice(startIdx), ...pool.slice(0, startIdx)];
})();

/** ms between hero snail slides */
export const HERO_SNAIL_SLIDE_INTERVAL_MS = 2800;

/** Unique featured snails on the home page — all set IDs >= 4, prefer teens. */
export const HOME_SNAIL_PLACEMENTS = {
  hero: 18 as SnailArtSetId,
  gallery: [15, 19, 20] as SnailArtSetId[],
  galleryFeatured: 16 as SnailArtSetId,
  mailBundle: 12 as SnailArtSetId,
  physicalFlow: 11 as SnailArtSetId,
  snailPals: 17 as SnailArtSetId,
  proFeature: 14 as SnailArtSetId,
  homeScreen: 19 as SnailArtSetId,
  cta: 13 as SnailArtSetId,
} as const;

export const MARKETING_SNAILS: {
  setId: SnailArtSetId;
  name: string;
  tag?: string;
}[] = [
  { setId: 16, name: "Stardust Slither", tag: "Featured" },
  { setId: 15, name: "Velvet Voyage" },
  { setId: 19, name: "Neon Nautilus" },
  { setId: 20, name: "Cosmic Crawl" },
];

export const SNAIL_COMBINATION_COUNT = 1_767_695_776;

export function formatSnailCombinationCount(): string {
  return "1.7 billion+";
}

/** Square post photos for the “How it works” flow — each step uses a different image. */
export const HOW_IT_WORKS_POSTS = [
  {
    src: "/marketing/posts/how-post.jpg",
    caption: "Sent · unlocking soon",
  },
  {
    src: "/marketing/posts/how-print.jpg",
    caption: "Printed postcard",
  },
  {
    src: "/marketing/posts/how-mail.jpg",
    caption: "Arrived today!",
  },
] as const;

export const MARKETING_POSTS = [
  { src: "/marketing/posts/hike.jpg", caption: "Weekend hike!", credit: "Unsplash" },
  { src: "/marketing/posts/friends.jpg", caption: "Miss you lots", credit: "Unsplash" },
  { src: "/marketing/posts/coffee.jpg", caption: "Coffee catch-up", credit: "Unsplash" },
  { src: "/marketing/posts/sunset.jpg", caption: "Golden hour", credit: "Unsplash" },
] as const;

export const APP_SCREENSHOTS = {
  home: "/marketing/screenshots/home.png",
  paywall: "/marketing/screenshots/paywall.png",
  friends: "/marketing/screenshots/friends.png",
} as const;

export const APP_SCREENSHOT_LABELS = {
  home: "Your snail pal",
  friends: "Find friends",
  paywall: "SnailMail Pro",
} as const;

/** Stock photography for the SnailMail Pro marketing page (Pexels, free to use). */
export const PRO_PAGE_PHOTOS = {
  hero: {
    src: "/marketing/pro/envelope-stack.jpg",
    alt: "Vintage envelopes and postcards tied with twine beside a fountain pen",
    credit: "Ylanite Koppens / Pexels",
  },
  whatArrives: {
    src: "/marketing/pro/letters-stack.jpg",
    alt: "Stack of handwritten letters and envelopes",
    credit: "Pixabay / Pexels",
  },
  mailbox: {
    src: "/marketing/pro/mailbox.jpg",
    alt: "Letter waiting in a mailbox",
    credit: "Benoit Roy / Pexels",
  },
} as const;
