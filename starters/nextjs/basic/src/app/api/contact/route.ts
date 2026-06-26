import { NextResponse } from "next/server";
import { getAdminDb, hasAdminCredentials, admin } from "@/lib/firebase/admin";
import type { ContactTopic } from "@/types";

const VALID_TOPICS: ContactTopic[] = ["general", "advertiser", "support", "partnership"];

/** Store contact submissions in the shared `contactSubmissions` collection. */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const company = String(body.company ?? "").trim();
  const topic = String(body.topic ?? "general") as ContactTopic;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  const safeTopic = VALID_TOPICS.includes(topic) ? topic : "general";

  if (!hasAdminCredentials()) {
    // Don't fake success — make the misconfiguration visible to operators.
    return NextResponse.json(
      {
        error:
          "Server is not configured to store submissions yet (missing Firebase Admin credentials).",
      },
      { status: 503 },
    );
  }

  try {
    await getAdminDb()
      .collection("contactSubmissions")
      .add({
        name,
        email,
        company,
        topic: safeTopic,
        message,
        status: "new",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("contact submission failed", err);
    return NextResponse.json({ error: "Could not save your message." }, { status: 500 });
  }
}
