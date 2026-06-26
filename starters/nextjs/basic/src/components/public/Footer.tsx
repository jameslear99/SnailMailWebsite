import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/Container";
import { FOOTER_NAV, SITE } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted">{SITE.tagline}</p>
          </div>
          {Object.entries(FOOTER_NAV).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-2">
                {heading}
              </h4>
              <ul className="mt-3 space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-2 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.company}. All rights reserved.
          </p>
          <p>Open rates are estimated. Ads are manually reviewed before printing.</p>
        </div>
      </Container>
    </footer>
  );
}
