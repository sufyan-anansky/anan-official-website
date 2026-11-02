import { NextResponse } from "next/server";
import { serverContactSchema } from "@/lib/contact-schema";
import { isContactRateLimited, sendContactInquiry } from "@/lib/smtp";

function clientAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const address = forwarded?.split(",")[0]?.trim();
  return address || "unknown";
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (isContactRateLimited(clientAddress(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const parsed = serverContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }

  const result = await sendContactInquiry(parsed.data);

  if (result.status === "not_configured") {
    return NextResponse.json(
      { error: "contact_delivery_not_configured" },
      { status: 503 },
    );
  }

  if (result.status === "failed") {
    return NextResponse.json({ error: "delivery_failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
