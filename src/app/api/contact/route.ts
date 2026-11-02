import { NextResponse } from "next/server";
import { serverContactSchema } from "@/lib/contact-schema";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const parsed = serverContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_submission" }, { status: 400 });
  }

  // TODO: Send the validated inquiry through the configured email provider.
  return NextResponse.json(
    { error: "contact_delivery_not_configured" },
    { status: 503 },
  );
}
