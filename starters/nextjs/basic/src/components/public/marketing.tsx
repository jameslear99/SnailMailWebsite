import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

export function Section({
  className,
  containerClassName,
  children,
  id,
}: {
  className?: string;
  containerClassName?: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description ? <p className="mt-4 text-lg text-muted">{description}</p> : null}
    </div>
  );
}

/**
 * A clean labeled placeholder block for future app screenshots, mockups, or
 * snail art. No fake imagery — just an intentional empty slot.
 */
export function AssetPlaceholder({
  label,
  className,
  ratio = "aspect-[4/3]",
}: {
  label: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <div
      className={cn(
        "bg-grid flex items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border-strong bg-surface-muted/60 text-center",
        ratio,
        className,
      )}
    >
      <div className="px-6">
        <div className="mx-auto mb-2 flex size-9 items-center justify-center rounded-full bg-surface text-muted-2 shadow-sm">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 15 4-4 5 5M14 13l3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="9" r="1.5" />
          </svg>
        </div>
        <p className="text-xs font-medium text-muted-2">{label}</p>
      </div>
    </div>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-sm transition-shadow hover:shadow-md">
      {icon ? (
        <div className="mb-4 flex size-10 items-center justify-center rounded-[var(--radius)] bg-brand-50 text-brand-700">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
