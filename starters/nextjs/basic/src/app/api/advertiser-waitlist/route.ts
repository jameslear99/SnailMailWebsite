import { NextResponse } from "next/server";
import { getAdminDb, hasAdminCredentials, admin } from "@/lib/firebase/admin";

const VALID_SOURCES = ["advertisers", "pricing", "website"] as const;
type WaitlistSource = (typeof VALID_SOURCES)[number];

/** Store advertiser early-access signups in `advertiserWaitlist`. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const rawSource = String(body.source ?? "website");
  const source: WaitlistSource = VALID_SOURCES.includes(rawSource as WaitlistSource)
    ? (rawSource as WaitlistSource)
    : "website";

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (!hasAdminCredentials()) {
    return NextResponse.json(
      {
        error:
          "Server is not configured to store signups yet (missing Firebase Admin credentials).",
      },
      { status: 503 },
    );
  }

  try {
    const db = getAdminDb();
    const existing = await db
      .collection("advertiserWaitlist")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return NextResponse.json({ ok: true, alreadyRegistered: true });
    }

    await db.collection("advertiserWaitlist").add({
      name,
      email,
      source,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("advertiser waitlist signup failed", err);
    return NextResponse.json({ error: "Could not save your signup." }, { status: 500 });
  }
}
