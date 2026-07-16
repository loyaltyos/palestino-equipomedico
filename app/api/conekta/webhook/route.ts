import { after, NextRequest, NextResponse } from "next/server";
import {
  logWebhookDiagnostic,
  normalizeWebhookDigest,
  normalizeWebhookPublicKey,
  parseWebhookEvent,
  processWebhookEvent,
  verifyWebhook,
} from "@/lib/conekta-webhook";

export const runtime = "nodejs";

export function GET() {
  const publicKey = normalizeWebhookPublicKey(process.env.CONEKTA_WEBHOOK_SECRET);
  return NextResponse.json({
    ok: true,
    endpoint: "conekta-webhook",
    configured: publicKey.present && publicKey.formatValid,
  });
}

export async function POST(request: NextRequest) {
  const digestHeader = request.headers.get("digest");
  const rawBody = await request.text();
  const digest = normalizeWebhookDigest(digestHeader);
  const publicKey = normalizeWebhookPublicKey(process.env.CONEKTA_WEBHOOK_SECRET);
  const signatureValid = Boolean(
    digest.signature &&
    publicKey.formatValid &&
    verifyWebhook(rawBody, digest.signature, publicKey.normalized),
  );
  const event = parseWebhookEvent(rawBody);
  logWebhookDiagnostic({
    digest_present: Boolean(digestHeader),
    digest_format: digest.format,
    public_key_present: publicKey.present,
    public_key_format_valid: publicKey.formatValid,
    signature_valid: signatureValid,
    event_type: typeof event?.type === "string" ? event.type : null,
    livemode: typeof event?.livemode === "boolean" ? event.livemode : null,
    body_length: Buffer.byteLength(rawBody, "utf8"),
  });
  if (!signatureValid) return NextResponse.json({ received: false }, { status: 401 });
  if (!event) return NextResponse.json({ received: false }, { status: 400 });
  after(() => processWebhookEvent(event));
  return NextResponse.json({ received: true });
}
