import { after, NextRequest, NextResponse } from "next/server";
import { processWebhookEvent, verifyWebhook } from "@/lib/conekta-webhook";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const publicKey = process.env.CONEKTA_WEBHOOK_SECRET;
  const digest = request.headers.get("digest");
  if (!publicKey || !digest) return NextResponse.json({ received: false }, { status: 401 });
  const rawBody = await request.text();
  if (!verifyWebhook(rawBody, digest, publicKey.replace(/\\n/g, "\n"))) return NextResponse.json({ received: false }, { status: 401 });
  let event: Parameters<typeof processWebhookEvent>[0];
  try { event = JSON.parse(rawBody); } catch { return NextResponse.json({ received: false }, { status: 400 }); }
  after(() => processWebhookEvent(event));
  return NextResponse.json({ received: true });
}
