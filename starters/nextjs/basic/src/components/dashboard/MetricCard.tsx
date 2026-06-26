import { Icon, type IconName } from "./icons";
import { cn } from "@/lib/cn";

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: IconName;
  tone?: "brand" | "success" | "info" | "neutral";
}) {
  const toneClasses: Record<string, string> = {
    brand: "bg-brand-50 text-brand-700",
    success: "bg-success-bg text-success",
    info: "bg-info-bg text-info",
    neutral: "bg-surface-muted text-muted",
  };
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        {icon ? (
          <span className={cn("flex size-8 items-center justify-center rounded-[var(--radius)]", toneClasses[tone])}>
            <Icon name={icon} className="size-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-2">{hint}</p> : null}
    </div>
  );
}
