import Image from "next/image";
import { cn } from "@/lib/cn";
import {
  APP_SCREENSHOTS,
  APP_SCREENSHOT_LABELS,
  HOME_SNAIL_PLACEMENTS,
  HOW_IT_WORKS_POSTS,
  MARKETING_POSTS,
  MARKETING_SNAILS,
  type SnailArtSetId,
} from "@/config/marketing-assets";
import { HeroSnailSlideshow } from "@/components/public/hero-snail-slideshow";
import { SnailArtComposite } from "@/components/public/snail-art-composite";

export { SnailArtComposite } from "@/components/public/snail-art-composite";

function PostTile({
  src,
  caption,
  className,
  rotate = 0,
}: {
  src: string;
  caption?: string;
  className?: string;
  rotate?: number;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-md",
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <div className="relative aspect-square w-full">
        <Image src={src} alt="" fill className="object-cover" sizes="200px" />
      </div>
      {caption ? (
        <div className="border-t border-border bg-surface px-2.5 py-2">
          <p className="truncate text-[10px] font-medium text-foreground">{caption}</p>
          <p className="text-[9px] text-muted-2">via Snail Mail</p>
        </div>
      ) : null}
    </div>
  );
}

export function AppScreenshot({
  src,
  alt,
  className,
  priority = false,
  label,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  label?: string;
}) {
  return (
    <figure className={cn("group", className)}>
      <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_24px_48px_-12px_rgb(14_16_20_/_0.18)] ring-1 ring-border/80 transition-transform duration-500 group-hover:-translate-y-1">
        <Image
          src={src}
          alt={alt}
          width={430}
          height={932}
          priority={priority}
          className="h-auto w-full"
          sizes="(max-width: 768px) 42vw, 220px"
        />
      </div>
      {label ? (
        <figcaption className="mt-3 text-center text-xs font-medium tracking-wide text-muted-2 uppercase">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Full-width landing hero — copy left, giant snail right, app strip below. */
export function LandingHero({
  headline,
  subhead,
  tagline,
  children,
  className,
}: {
  headline: React.ReactNode;
  subhead: React.ReactNode;
  tagline?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-border bg-landing-hero", className)}>
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-8 pt-14 pb-10 sm:gap-10 sm:pt-20 sm:pb-12 lg:grid-cols-12 lg:gap-8 lg:pt-24 lg:pb-8">
          <div className="order-1 lg:col-span-6 lg:col-start-1 lg:row-start-1">
            {headline}
          </div>

          <div className="order-3 lg:order-none lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2 lg:flex lg:justify-end">
            <HeroSnailSlideshow className="lg:w-full" />
          </div>

          <div className="order-2 flex flex-col gap-6 sm:gap-8 lg:order-none lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:justify-center lg:pb-4">
            {subhead}
            {children}
            {tagline ? <div className="text-sm text-muted-2">{tagline}</div> : null}
          </div>
        </div>

        <AppShowcaseStrip className="pb-12 sm:pb-16 lg:pb-24" />
      </div>
    </section>
  );
}

/** Staggered screenshot strip — no overlap with hero snail. */
export function AppShowcaseStrip({ className }: { className?: string }) {
  const shots = [
    { src: APP_SCREENSHOTS.home, alt: "Snail Mail home screen", label: APP_SCREENSHOT_LABELS.home },
    { src: APP_SCREENSHOTS.friends, alt: "Snail Mail friends screen", label: APP_SCREENSHOT_LABELS.friends },
    { src: APP_SCREENSHOTS.paywall, alt: "SnailMail Pro paywall", label: APP_SCREENSHOT_LABELS.paywall },
  ] as const;

  return (
    <div className={cn("relative", className)}>
      <div className="mb-6 flex items-end justify-between gap-4">
        <p className="text-sm font-medium text-muted">See it in the app</p>
        <div className="hidden h-px flex-1 bg-border sm:block" />
      </div>

      <div className="grid grid-cols-3 items-end gap-3 sm:gap-5 md:gap-8">
        {shots.map((shot, i) => (
          <AppScreenshot
            key={shot.src}
            src={shot.src}
            alt={shot.alt}
            label={shot.label}
            priority={i === 0}
            className={cn(
              i === 0 && "z-10",
              i === 1 && "translate-y-2 sm:translate-y-4",
              i === 2 && "translate-y-4 sm:translate-y-8",
            )}
          />
        ))}
      </div>
    </div>
  );
}

/** @deprecated Use LandingHero */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[440px]", className)}>
      <SnailArtComposite setId={HOME_SNAIL_PLACEMENTS.hero} fill priority className="aspect-square w-full" />
    </div>
  );
}

export function AppPhoneMockup({ className }: { className?: string }) {
  return (
    <AppScreenshot
      src={APP_SCREENSHOTS.home}
      alt="Snail Mail home screen"
      label={APP_SCREENSHOT_LABELS.home}
      className={cn("mx-auto w-[min(100%,260px)]", className)}
      priority
    />
  );
}

export function AppScreenshotPair({ className }: { className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 items-end gap-4 sm:gap-6", className)}>
      <AppScreenshot
        src={APP_SCREENSHOTS.friends}
        alt="Snail Mail friends screen"
        label={APP_SCREENSHOT_LABELS.friends}
      />
      <AppScreenshot
        src={APP_SCREENSHOTS.paywall}
        alt="SnailMail Pro paywall"
        label={APP_SCREENSHOT_LABELS.paywall}
        className="translate-y-6"
      />
    </div>
  );
}

export function MailBundleRender({ className }: { className?: string }) {
  const [postA, postB] = MARKETING_POSTS;

  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] items-end justify-center overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface-muted/50 p-6",
        className,
      )}
    >
      <PostTile
        className="absolute left-[8%] top-[8%] w-[34%]"
        src={postA.src}
        caption={postA.caption}
        rotate={-7}
      />
      <PostTile
        className="absolute right-[10%] top-[4%] w-[32%]"
        src={postB.src}
        caption={postB.caption}
        rotate={6}
      />

      <div className="relative z-10 w-[74%] max-w-sm">
        <div className="relative overflow-hidden rounded-md border border-[#d4c4a8] bg-[#f5eedc] shadow-lg">
          <div className="h-16 bg-[#ebe3cf]" style={{ clipPath: "polygon(0 0, 50% 70%, 100% 0)" }} />
          <div className="border-t border-[#d4c4a8] px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold text-[#3d3428]">Snail Mail Social</p>
                <p className="mt-0.5 text-[9px] text-[#6b5f4e]">Bundle · 2 square posts</p>
              </div>
              <SnailArtComposite
                setId={HOME_SNAIL_PLACEMENTS.mailBundle}
                size={36}
                includeAccessory={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PhysicalMailFlow({ className }: { className?: string }) {
  const [postStep, printStep, mailStep] = HOW_IT_WORKS_POSTS;

  const steps = [
    {
      label: "Post in app",
      detail: "Square photo + note from a friend",
      content: (
        <PostTile
          className="mx-auto w-[78%]"
          src={postStep.src}
          caption={postStep.caption}
        />
      ),
    },
    {
      label: "We print it",
      detail: "Full-color square postcard",
      content: (
        <div className="relative mx-auto w-[78%]">
          <PostTile src={printStep.src} caption={printStep.caption} />
          <span className="absolute -right-1 -top-1 rounded-full bg-brand-600 px-1.5 py-0.5 text-[8px] font-semibold text-on-inverse">
            PRINT
          </span>
        </div>
      ),
    },
    {
      label: "Mailbox delivery",
      detail: "Real mail you can keep",
      content: (
        <div className="mx-auto w-[78%] rounded-lg border-2 border-[#8b7355] bg-[#a08060] p-2 shadow-inner">
          <div className="rounded bg-[#3d3428] p-2">
            <div className="flex gap-1.5">
              <div className="relative aspect-square flex-1 overflow-hidden rounded-sm">
                <Image src={mailStep.src} alt="" fill className="object-cover" sizes="120px" />
              </div>
              <div className="flex aspect-square w-10 items-center justify-center rounded-sm bg-white/10">
                <SnailArtComposite
                  setId={HOME_SNAIL_PLACEMENTS.physicalFlow}
                  size={28}
                  includeAccessory={false}
                />
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn("grid gap-4 sm:grid-cols-3", className)}>
      {steps.map((step, i) => (
        <div
          key={step.label}
          className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-sm"
        >
          <span className="font-mono text-xs font-semibold text-brand-600">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-2 text-sm font-semibold text-foreground">{step.label}</p>
          <p className="text-xs text-muted">{step.detail}</p>
          <div className="mt-4 min-h-[132px]">{step.content}</div>
        </div>
      ))}
    </div>
  );
}

export function SnailArtBadge({
  setId,
  className,
  size = 320,
  name,
}: {
  setId: SnailArtSetId;
  className?: string;
  size?: number;
  name?: string;
}) {
  const meta = MARKETING_SNAILS.find((s) => s.setId === setId);

  return (
    <div className={cn("flex flex-col items-center justify-center p-4", className)}>
      <SnailArtComposite setId={setId} size={size} priority className="relative" />
      {name ?? meta?.name ? (
        <p className="mt-3 text-sm font-medium text-muted">{name ?? meta?.name}</p>
      ) : null}
    </div>
  );
}

/** Asymmetric bento gallery — one hero snail + three pals. */
export function SnailArtGallery({ className }: { className?: string }) {
  const featured = MARKETING_SNAILS.find((s) => s.setId === HOME_SNAIL_PLACEMENTS.galleryFeatured)!;
  const pals = MARKETING_SNAILS.filter((s) => s.setId !== featured.setId);

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2 lg:gap-5", className)}>
      <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-6 sm:col-span-2 lg:col-span-5 lg:row-span-2 lg:p-10">
        {featured.tag ? (
          <span className="inline-flex rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-on-inverse">
            {featured.tag}
          </span>
        ) : null}
        <div className="mx-auto mt-4 aspect-square w-full max-w-[280px] lg:max-w-none">
          <SnailArtComposite setId={featured.setId} fill className="size-full" />
        </div>
        <p className="mt-6 text-lg font-semibold text-foreground">{featured.name}</p>
      </div>

      {pals.map((snail, i) => (
        <div
          key={snail.setId}
          className={cn(
            "flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-border bg-background px-4 py-8 lg:col-span-7",
            i === 0 && "lg:row-start-1",
            i === 1 && "lg:row-start-2",
          )}
        >
          <SnailArtComposite setId={snail.setId} size={i === 0 ? 140 : 120} />
          <p className="mt-4 text-sm font-semibold text-foreground">{snail.name}</p>
        </div>
      ))}
    </div>
  );
}

/** Snail + screenshot duo for mid-page storytelling. */
export function SnailAppFeature({
  setId,
  screenshot,
  screenshotAlt,
  screenshotLabel,
  className,
  reverse = false,
}: {
  setId: SnailArtSetId;
  screenshot: string;
  screenshotAlt: string;
  screenshotLabel: string;
  className?: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
        className,
      )}
    >
      <div className="flex justify-center lg:justify-end">
        <div className="aspect-square w-full max-w-[min(100%,360px)]">
          <SnailArtComposite setId={setId} fill className="size-full" />
        </div>
      </div>
      <AppScreenshot
        src={screenshot}
        alt={screenshotAlt}
        label={screenshotLabel}
        className="mx-auto w-[min(100%,240px)] lg:mx-0"
      />
    </div>
  );
}
