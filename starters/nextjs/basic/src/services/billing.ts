import "server-only";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { admin } from "@/lib/firebase/admin";
import type { PaymentMethodSummary } from "@/types";

/**
 * Billing service (server-side). Wraps Stripe + Firestore billing data.
 *
 * Charging happens only AFTER fulfillment. Methods that would charge are
 * implemented as real Stripe calls guarded by config, or as clearly-labeled
 * placeholders for the future fulfillment system. We never fake a charge.
 */

const ACCOUNTS = "advertiserAccounts";

export type BillingState =
  | { configured: false }
  | {
      configured: true;
      stripeCustomerId: string | null;
      paymentMethods: PaymentMethodSummary[];
      invoices: {
        id: string;
        amountDue: number;
        currency: string;
        status: string;
        created: number;
        hostedInvoiceUrl: string | null;
        pdfUrl: string | null;
      }[];
    };

/** Create (or fetch) a Stripe customer for an advertiser account. */
export async function ensureStripeCustomer(accountId: string): Promise<string> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");

  const db = getAdminDb();
  const ref = db.collection(ACCOUNTS).doc(accountId);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Advertiser account not found.");
  const data = snap.data()!;

  if (data.stripeCustomerId) return data.stripeCustomerId as string;

  const customer = await stripe.customers.create({
    name: data.businessName,
    email: data.contactEmail,
    metadata: { advertiserAccountId: accountId },
  });

  await ref.update({
    stripeCustomerId: customer.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return customer.id;
}

/** Create a SetupIntent so the advertiser can store a payment method for later. */
export async function createSetupIntent(accountId: string): Promise<string> {
  const stripe = getStripe();
  if (!stripe) throw new Error("Stripe is not configured.");
  const customerId = await ensureStripeCustomer(accountId);
  const intent = await stripe.setupIntents.create({
    customer: customerId,
    usage: "off_session", // charged later, post-fulfillment
  });
  if (!intent.client_secret) throw new Error("Failed to create setup intent.");
  return intent.client_secret;
}

export async function getBillingState(accountId: string): Promise<BillingState> {
  if (!isStripeConfigured()) return { configured: false };
  const stripe = getStripe()!;

  const db = getAdminDb();
  const snap = await db.collection(ACCOUNTS).doc(accountId).get();
  const stripeCustomerId = (snap.data()?.stripeCustomerId as string | undefined) ?? null;

  if (!stripeCustomerId) {
    return { configured: true, stripeCustomerId: null, paymentMethods: [], invoices: [] };
  }

  const [methods, customer, invoices] = await Promise.all([
    stripe.paymentMethods.list({ customer: stripeCustomerId, type: "card" }),
    stripe.customers.retrieve(stripeCustomerId),
    stripe.invoices.list({ customer: stripeCustomerId, limit: 20 }),
  ]);

  const defaultPm =
    typeof customer !== "string" && !("deleted" in customer)
      ? (customer.invoice_settings?.default_payment_method as string | null)
      : null;

  return {
    configured: true,
    stripeCustomerId,
    paymentMethods: methods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand ?? "card",
      last4: pm.card?.last4 ?? "----",
      expMonth: pm.card?.exp_month ?? 0,
      expYear: pm.card?.exp_year ?? 0,
      isDefault: pm.id === defaultPm,
    })),
    invoices: invoices.data.map((inv) => ({
      id: inv.id ?? "",
      amountDue: inv.amount_due,
      currency: inv.currency,
      status: inv.status ?? "unknown",
      created: inv.created,
      hostedInvoiceUrl: inv.hosted_invoice_url ?? null,
      pdfUrl: inv.invoice_pdf ?? null,
    })),
  };
}

/**
 * PLACEHOLDER for the future fulfillment system.
 *
 * Once the print/fulfillment pipeline reports the ACTUAL printed quantity, the
 * admin/fulfillment service will call this to invoice the advertiser for the
 * real amount (pricePerPrintedAd * actualPrintedQuantity). It is intentionally
 * not wired to any UI button here, because advertisers must never trigger their
 * own charge and we must not bill before fulfillment.
 */
export async function createPostFulfillmentInvoice(_params: {
  accountId: string;
  campaignId: string;
  actualPrintedQuantity: number;
  pricePerPrintedAd: number;
}): Promise<never> {
  throw new Error(
    "Not implemented: post-fulfillment invoicing is triggered by the admin/fulfillment system once actual printed quantity is known.",
  );
}
