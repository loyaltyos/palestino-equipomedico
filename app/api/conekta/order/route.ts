import { NextRequest, NextResponse } from "next/server";
import { buildServerCart, validateCustomer } from "@/lib/checkout";
import { createConektaCheckout } from "@/lib/conekta";

export const runtime = "nodejs";
const attempts = new Map<string, { count: number; resetAt: number }>();
const friendlyError = "No fue posible cargar el formulario de pago. Intenta nuevamente.";

function rateLimited(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const current = attempts.get(ip);
  if (!current || current.resetAt <= now) {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  return ++current.count > 5;
}

export async function POST(request: NextRequest) {
  if (rateLimited(request)) return NextResponse.json({ error: friendlyError }, { status: 429 });
  if (!process.env.CONEKTA_PRIVATE_KEY) {
    console.error("checkout_request_status", { ok: false, reason: "private_key_missing" });
    return NextResponse.json({ error: "El pago no está disponible temporalmente." }, { status: 503 });
  }

  console.info("checkout_request_started");
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const customer = validateCustomer(body.customer);
    const cart = buildServerCart(body.items);
    if (!customer || !cart) {
      console.warn("checkout_request_status", { ok: false, reason: "invalid_input" });
      return NextResponse.json({ error: friendlyError }, { status: 400 });
    }

    const checkout = await createConektaCheckout(customer, cart);
    console.info("checkout_request_status", { ok: true, status: checkout.status });
    console.info("checkout_request_id_present", true);
    return NextResponse.json({
      checkoutRequestId: checkout.checkoutRequestId,
      orderId: checkout.orderId,
      status: checkout.status,
      total: cart.total,
      currency: "MXN",
    });
  } catch (error) {
    console.error("checkout_request_status", {
      ok: false,
      reason: error instanceof Error ? error.message.replace(/key_[A-Za-z0-9]+/g, "[redacted]") : "unknown",
    });
    return NextResponse.json({ error: friendlyError }, { status: 502 });
  }
}
