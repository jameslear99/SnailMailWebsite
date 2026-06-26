import Link from "next/link";
import { cn } from "@/lib/cn";

/** Path to the spiral mark copied from SnailMailSocial/assets/images/brand_logo.png */
const BRAND_LOGO_SRC = "/brand-logo.png";

type LogoMarkColor = "brand" | "foreground" | "inverse";

const markColorClass: Record<LogoMarkColor, string> = {
  brand: "bg-brand",
  foreground: "bg-foreground",
  inverse: "bg-on-inverse",
};

/**
 * Spiral brand mark — same asset as the Flutter app's SnailMailBrandMark.
 * Rendered with a CSS mask so it can be tinted like the app's srcIn blend.
 */
export function LogoMark({
  className,
  size = 28,
  color = "brand",
}: {
  className?: string;
  /** Width and height in pixels */
  size?: number;
  color?: LogoMarkColor;
}) {
  return (
    <span
      className={cn("inline-block shrink-0", markColorClass[color], className)}
      style={{
        width: size,
        height: size,
        WebkitMaskImage: `url(${BRAND_LOGO_SRC})`,
        maskImage: `url(${BRAND_LOGO_SRC})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
      role="img"
      aria-label="Snail Mail"
    />
  );
}

export function Logo({
  href = "/",
  className,
  variant = "default",
  markColor,
}: {
  href?: string;
  className?: string;
  variant?: "default" | "inverse";
  /** Override mark tint; defaults to brand on light backgrounds, inverse on dark */
  markColor?: LogoMarkColor;
}) {
  const resolvedMark =
    markColor ?? (variant === "inverse" ? "inverse" : "brand");

  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark color={resolvedMark} />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          variant === "inverse" ? "text-on-inverse" : "text-foreground",
        )}
      >
        Snail Mail Social
      </span>
    </Link>
  );
}
