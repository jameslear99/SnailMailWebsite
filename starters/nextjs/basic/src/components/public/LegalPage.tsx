import { Container } from "@/components/ui/Container";
import { Alert } from "@/components/ui/Feedback";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <Container className="max-w-3xl py-16 sm:py-20">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-2">Last updated: {lastUpdated}</p>

      <Alert tone="warning" className="mt-6" title="Placeholder — pending legal review">
        This document is a placeholder and does not constitute legal advice. It must be reviewed and
        finalized by qualified legal counsel before launch.
      </Alert>

      <p className="mt-8 text-muted">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold text-foreground">
              {i + 1}. {s.heading}
            </h2>
            {s.body.map((p, j) => (
              <p key={j} className="mt-2 text-sm leading-relaxed text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </Container>
  );
}
