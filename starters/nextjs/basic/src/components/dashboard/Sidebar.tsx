"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Icon, type IconName } from "./icons";
import { DASHBOARD_NAV } from "@/config/site";
import { cn } from "@/lib/cn";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r border-border bg-surface">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {DASHBOARD_NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted hover:bg-surface-muted hover:text-foreground",
              )}
            >
              <Icon name={item.icon as IconName} className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <Link
          href="/dashboard/campaigns/new"
          onClick={onNavigate}
          className="flex items-center justify-center gap-2 rounded-[var(--radius)] bg-brand px-3 py-2.5 text-sm font-medium text-brand-foreground hover:bg-brand-700"
        >
          <Icon name="plus" className="size-4" /> New campaign
        </Link>
      </div>
    </div>
  );
}
