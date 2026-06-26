import { NextResponse } from "next/server";
import { verifyRequest, userInAccount } from "@/lib/firebase/verify-request";
import { createSetupIntent } from "@/services/billing";
import { isStripeConfigured } from "@/lib/stripe/server";

/** POST /api/billing/setup-intent — create a SetupIntent to store a card. */
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Stripe is not configured." }, { status: 503 });
  }
  let body: { accountId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body." }, { status: 400 });
  }
  const accountId = body.accountId;
  if (!accountId) return NextResponse.json({ error: "Missing accountId." }, { status: 400 });

  const auth = await verifyRequest(request);
  if (!auth) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!(await userInAccount(auth.uid, accountId))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const clientSecret = await createSetupIntent(accountId);
    return NextResponse.json({ clientSecret });
  } catch (err) {
    console.error("setup intent failed", err);
    return NextResponse.json({ error: "Could not start card setup." }, { status: 500 });
  }
}
