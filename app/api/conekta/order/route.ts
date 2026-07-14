import { NextRequest, NextResponse } from "next/server";
import { buildServerCart, validateCustomer } from "@/lib/checkout";
import { createConektaOrder, paymentResult } from "@/lib/conekta";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; resetAt: number }>();
const friendlyError = "No fue posible procesar el pago. Revisa tus datos o utiliza otra tarjeta.";

function rateLimited(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) { attempts.set(ip, { count: 1, resetAt: now + 60_000 }); return false; }
  return ++current.count > 5;
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) return NextResponse.json({ error: friendlyError }, { status: 429 });
  if (!process.env.CONEKTA_PRIVATE_KEY) return NextResponse.json({ error: "El pago no está disponible temporalmente." }, { status: 503 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const tokenId = typeof body.tokenId === "string" ? body.tokenId.trim() : "";
    const customer = validateCustomer(body.customer);
    const cart = buildServerCart(body.items);
    if (!/^tok_[A-Za-z0-9]+$/.test(tokenId) || !customer || !cart) return NextResponse.json({ error: friendlyError }, { status: 400 });
    return NextResponse.json(paymentResult(await createConektaOrder(tokenId, customer, cart), cart));
  } catch { return NextResponse.json({ error: friendlyError }, { status: 402 }); }
}
