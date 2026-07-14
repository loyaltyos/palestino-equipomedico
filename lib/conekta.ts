import type { CustomerInput } from "@/lib/checkout";
import { buildServerCart } from "@/lib/checkout";

type ServerCart = NonNullable<ReturnType<typeof buildServerCart>>;

export async function createConektaOrder(tokenId: string, customer: CustomerInput, cart: ServerCart) {
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) throw new Error("CONEKTA_NOT_CONFIGURED");
  const response = await fetch("https://api.conekta.io/orders", {
    method: "POST", cache: "no-store",
    headers: { Accept: "application/vnd.conekta-v2.2.0+json", "Accept-Language": "es", "Content-Type": "application/json", Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}` },
    body: JSON.stringify({
      currency: "MXN",
      customer_info: { name: customer.name, email: customer.email, phone: customer.phone },
      shipping_contact: { receiver: customer.name, phone: customer.phone, address: { street1: customer.address.street, city: customer.address.city, state: customer.address.state, postal_code: customer.address.postalCode, country: "MX", residential: true } },
      line_items: cart.items.map((item) => ({ name: item.name, sku: item.id, unit_price: item.unitPrice, quantity: item.quantity })),
      charges: [{ payment_method: { type: "card", token_id: tokenId } }],
      metadata: { integration: "Next.js", store: "Palestina" },
    }),
  });
  const data = await response.json().catch(() => ({})) as Record<string, unknown>;
  if (!response.ok) throw new Error("CONEKTA_PAYMENT_FAILED");
  return data;
}

export function paymentResult(order: Record<string, unknown>, cart: ServerCart) {
  const status = typeof order.payment_status === "string" ? order.payment_status : "";
  return { status: status === "paid" ? "paid" : status.includes("pending") ? "pending" : "failed", orderId: typeof order.id === "string" ? order.id : "", total: cart.total, currency: "MXN", items: cart.items };
}
