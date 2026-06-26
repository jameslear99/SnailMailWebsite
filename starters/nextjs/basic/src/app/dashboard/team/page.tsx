"use client";

import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Feedback";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";

const ROLES: { id: string; label: string; desc: string }[] = [
  { id: "owner", label: "Owner", desc: "Full access, including billing and team." },
  { id: "admin", label: "Admin", desc: "Manage campaigns, billing, and team." },
  { id: "marketer", label: "Marketer", desc: "Create and manage campaigns." },
  { id: "viewer", label: "Viewer", desc: "Read-only access to campaigns and reports." },
];

export default function TeamPage() {
  const { activeAccount, advertiserUser, user } = useAuth();
  if (!activeAccount || !advertiserUser) return null;

  const myRole = advertiserUser.accounts?.[activeAccount.id] ?? "owner";
  const memberCount = activeAccount.memberUserIds?.length ?? 1;

  return (
    <>
      <PageHeader title="Team" description="Manage who can access this advertiser account." />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader>
            <CardTitle>Members ({memberCount})</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-3">
              <li className="flex items-center justify-between rounded-[var(--radius)] border border-border p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-surface-inverse text-sm font-semibold text-on-inverse">
                    {(user?.displayName || user?.email || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{user?.displayName || user?.email}</p>
                    <p className="text-xs text-muted-2">{user?.email} · You</p>
                  </div>
                </div>
                <Badge tone="brand">{myRole}</Badge>
              </li>
              {memberCount > 1 ? (
                <li className="rounded-[var(--radius)] border border-border p-4 text-sm text-muted">
                  + {memberCount - 1} other member{memberCount - 1 > 1 ? "s" : ""}
                </li>
              ) : null}
            </ul>

            <div className="mt-6 border-t border-border pt-6">
              <p className="mb-3 text-sm font-medium">Invite a teammate</p>
              <Alert tone="info" className="mb-4">
                Email invitations are coming soon. For now, a teammate can create an account and be
                added by an owner.
              </Alert>
              <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto]">
                <Field>
                  <Input type="email" placeholder="teammate@company.com" disabled />
                </Field>
                <Field>
                  <Select disabled defaultValue="marketer">
                    {ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Button disabled>
                  <Icon name="plus" className="size-4" /> Invite
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Roles</CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-4">
              {ROLES.map((r) => (
                <li key={r.id}>
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-muted">{r.desc}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
