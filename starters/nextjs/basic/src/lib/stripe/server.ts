import "server-only";
import Stripe from "stripe";

/**
 * Server-side Stripe client. Returns null when STRIPE_SECRET_KEY is not set so
 * the portal can run in a "billing not configured" state without crashing.
 *
 * Billing rule: advertisers are charged ONLY after ads are actually
 * printed/sent, based on the actual quantity. We never charge upfront and we
 * never fake a successful charge. Charging will be triggered by the future
 * fulfillment/admin system via `createPostFulfillmentInvoice` below.
 */

let _stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  if (_stripe) return _stripe;
  _stripe = new Stripe(key);
  return _stripe;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}
