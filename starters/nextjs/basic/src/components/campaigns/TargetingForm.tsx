"use client";

import { Field, Input, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/dashboard/icons";
import {
  GENDER_OPTIONS,
  INTEREST_OPTIONS,
  MAXIMUM_TARGETABLE_AGE,
  MINIMUM_TARGETABLE_AGE,
  RADIUS_OPTIONS_MILES,
} from "@/config/targeting";
import { cn } from "@/lib/cn";
import type { CampaignTargeting } from "@/types";

function parseList(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function TargetingForm({
  value,
  onChange,
}: {
  value: CampaignTargeting;
  onChange: (next: CampaignTargeting) => void;
}) {
  const set = (patch: Partial<CampaignTargeting>) => onChange({ ...value, ...patch });

  const genders = value.gender ?? [];
  const interests = value.interests ?? [];
  const radiusTargets = value.locations?.radiusTargets ?? [];

  function toggleGender(id: string) {
    if (id === "all") {
      set({ gender: genders.includes("all") ? [] : ["all"] });
      return;
    }
    const without = genders.filter((g) => g !== "all");
    set({
      gender: without.includes(id) ? without.filter((g) => g !== id) : [...without, id],
    });
  }

  function toggleInterest(name: string) {
    set({
      interests: interests.includes(name)
        ? interests.filter((i) => i !== name)
        : [...interests, name],
    });
  }

  function updateLocations(patch: Partial<NonNullable<CampaignTargeting["locations"]>>) {
    set({ locations: { ...value.locations, ...patch } });
  }

  return (
    <div className="space-y-8">
      {/* Location */}
      <section>
        <h3 className="text-sm font-semibold text-foreground">Location</h3>
        <p className="mb-3 text-xs text-muted">Target by city, ZIP code, or a radius around a ZIP.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Cities" hint="comma-separated">
            <Input
              placeholder="Austin, Denver"
              defaultValue={(value.locations?.cities ?? []).join(", ")}
              onBlur={(e) => updateLocations({ cities: parseList(e.target.value) })}
            />
          </Field>
          <Field label="ZIP codes" hint="comma-separated">
            <Input
              placeholder="78701, 80202"
              defaultValue={(value.locations?.zipCodes ?? []).join(", ")}
              onBlur={(e) => updateLocations({ zipCodes: parseList(e.target.value) })}
            />
          </Field>
        </div>

        <div className="mt-4">
          <Label>Radius targets</Label>
          <div className="mt-2 space-y-2">
            {radiusTargets.map((rt, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  className="w-36"
                  placeholder="ZIP"
                  value={rt.centerZipCode}
                  onChange={(e) => {
                    const next = [...radiusTargets];
                    next[i] = { ...rt, centerZipCode: e.target.value };
                    updateLocations({ radiusTargets: next });
                  }}
                />
                <select
                  className="h-11 rounded-[var(--radius)] border border-border-strong bg-surface px-3 text-sm"
                  value={rt.radiusMiles}
                  onChange={(e) => {
                    const next = [...radiusTargets];
                    next[i] = { ...rt, radiusMiles: Number(e.target.value) };
                    updateLocations({ radiusTargets: next });
                  }}
                >
                  {RADIUS_OPTIONS_MILES.map((m) => (
                    <option key={m} value={m}>
                      {m} mi
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() =>
                    updateLocations({ radiusTargets: radiusTargets.filter((_, j) => j !== i) })
                  }
                  className="inline-flex size-9 items-center justify-center rounded-[var(--radius)] text-muted hover:bg-surface-muted"
                  aria-label="Remove radius target"
                >
                  <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                updateLocations({
                  radiusTargets: [...radiusTargets, { centerZipCode: "", radiusMiles: 25 }],
                })
              }
            >
              <Icon name="plus" className="size-4" /> Add radius target
            </Button>
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground">Demographics</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Gender</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((g) => {
                const active = genders.includes(g.id);
                return (
                  <button
                    type="button"
                    key={g.id}
                    onClick={() => toggleGender(g.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm transition-colors",
                      active
                        ? "border-brand-400 bg-brand-50 text-brand-700"
                        : "border-border-strong text-muted hover:bg-surface-muted",
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <Label hint={`minimum age ${MINIMUM_TARGETABLE_AGE}`}>Age range</Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                type="number"
                min={MINIMUM_TARGETABLE_AGE}
                max={MAXIMUM_TARGETABLE_AGE}
                placeholder="Min"
                value={value.ageRange?.min ?? ""}
                onChange={(e) =>
                  set({
                    ageRange: {
                      ...value.ageRange,
                      min: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
              />
              <span className="text-muted-2">to</span>
              <Input
                type="number"
                min={MINIMUM_TARGETABLE_AGE}
                max={MAXIMUM_TARGETABLE_AGE}
                placeholder="Max"
                value={value.ageRange?.max ?? ""}
                onChange={(e) =>
                  set({
                    ageRange: {
                      ...value.ageRange,
                      max: e.target.value ? Number(e.target.value) : undefined,
                    },
                  })
                }
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-2">
              Minors cannot be targeted as a segment. Targeting starts at age {MINIMUM_TARGETABLE_AGE}.
            </p>
          </div>
        </div>
      </section>

      {/* Interests */}
      <section className="border-t border-border pt-6">
        <h3 className="text-sm font-semibold text-foreground">Interests</h3>
        <p className="mb-3 text-xs text-muted">Select the interests that best match your audience.</p>
        <div className="flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((name) => {
            const active = interests.includes(name);
            return (
              <button
                type="button"
                key={name}
                onClick={() => toggleInterest(name)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "border-brand-400 bg-brand-50 text-brand-700"
                    : "border-border-strong text-muted hover:bg-surface-muted",
                )}
              >
                {name}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
