"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Alert, EmptyState, LoadingState } from "@/components/ui/Feedback";
import { Icon } from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { formatCents } from "@/lib/format";
import type { BillingState } from "@/services/billing";

export default function BillingPage() {
  const { activeAccount, user } = useAuth();
  const [state, setState] = useState<BillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!activeAccount || !user) return;
    setLoading(true);
    setError(null);
    try {
      const token = await getFirebaseAuth().currentUser?.getIdToken();
      const res = await fetch(`/api/billing?accountId=${activeAccount.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Could not load billing.");
      setState(json as BillingState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load billing.");
    } finally {
      setLoading(false);
    }
  }, [activeAccount, user]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <PageHeader
        title="Billing"
        description="Manage payment methods and view invoices. You're only charged after ads are printed and sent."
      />

      <Alert tone="info" className="mb-6" title="How billing works">
        We never charge upfront. After a campaign&apos;s ads are physically printed and mailed,
        you&apos;re invoiced for the actual quantity at your ad tier&apos;s per-ad price.
      </Alert>

      {loading ? (
        <LoadingState />
      ) : error ? (
        <Alert tone="danger">{error}</Alert>
      ) : !state?.configured ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<Icon name="card" className="size-6" />}
              title="Billing isn't connected yet"
              description="Stripe hasn't been configured for this environment. Add your Stripe keys to enable payment methods and invoices. No charges are ever made until ads are printed and sent."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Payment methods */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Payment methods</CardTitle>
                <Button size="sm" variant="outline" disabled title="Card entry opens Stripe (configure to enable)">
                  <Icon name="plus" className="size-4" /> Add card
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              {state.paymentMethods.length === 0 ? (
                <p className="text-sm text-muted">
                  No payment methods saved. Add a card so we can invoice you after fulfillment.
                </p>
              ) : (
                <ul className="space-y-3">
                  {state.paymentMethods.map((pm) => (
                    <li
                      key={pm.id}
                      className="flex items-center justify-between rounded-[var(--radius)] border border-border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name="card" className="size-5 text-muted" />
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {pm.brand} •••• {pm.last4}
                          </p>
                          <p className="text-xs text-muted-2">
                            Expires {pm.expMonth}/{pm.expYear}
                          </p>
                        </div>
                      </div>
                      {pm.isDefault ? (
                        <span className="rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-medium text-success">
                          Default
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Invoices */}
          <Card>
            <CardHeader>
              <CardTitle>Invoices &amp; billing history</CardTitle>
            </CardHeader>
            <CardBody>
              {state.invoices.length === 0 ? (
                <p className="text-sm text-muted">No invoices yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wide text-muted-2">
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Amount</th>
                        <th className="py-2 pr-4">Status</th>
                        <th className="py-2" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {state.invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="py-3 pr-4 text-muted">
                            {new Date(inv.created * 1000).toLocaleDateString()}
                          </td>
                          <td className="py-3 pr-4 font-medium">{formatCents(inv.amountDue)}</td>
                          <td className="py-3 pr-4 capitalize text-muted">{inv.status}</td>
                          <td className="py-3 text-right">
                            {inv.hostedInvoiceUrl ? (
                              <a
                                href={inv.hostedInvoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-700 hover:underline"
                              >
                                View
                              </a>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </>
  );
}
