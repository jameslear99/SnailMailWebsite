import { NextResponse } from "next/server";
import { verifyRequest, userInAccount } from "@/lib/firebase/verify-request";
import { getBillingState } from "@/services/billing";

/** GET /api/billing?accountId=... — returns Stripe billing state for an account. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get("accountId");
  if (!accountId) {
    return NextResponse.json({ error: "Missing accountId." }, { status: 400 });
  }

  const auth = await verifyRequest(request);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!(await userInAccount(auth.uid, accountId))) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const state = await getBillingState(accountId);
    return NextResponse.json(state);
  } catch (err) {
    console.error("billing state failed", err);
    return NextResponse.json({ error: "Could not load billing." }, { status: 500 });
  }
}
