import type { CustomerInput } from "@/lib/checkout";
import { buildServerCart } from "@/lib/checkout";

type ServerCart = NonNullable<ReturnType<typeof buildServerCart>>;

type ConektaCheckoutResponse = {
  id?: unknown;
  checkout?: { id?: unknown; status?: unknown; type?: unknown };
};

export async function createConektaCheckout(customer: CustomerInput, cart: ServerCart) {
  const privateKey = process.env.CONEKTA_PRIVATE_KEY;
  if (!privateKey) throw new Error("CONEKTA_NOT_CONFIGURED");

  const response = await fetch("https://api.conekta.io/orders", {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/vnd.conekta-v2.2.0+json",
      "Accept-Language": "es",
      "Content-Type": "application/json",
      Authorization: `Bearer ${privateKey}`,
    },
    body: JSON.stringify({
      checkout: {
        name: `Pedido Palestina ${Date.now()}`,
        type: "Integration",
        allowed_payment_methods: ["card"],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      },
      currency: "MXN",
      customer_info: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      },
      shipping_contact: {
        receiver: customer.name,
        phone: customer.phone,
        address: {
          street1: customer.address.street,
          city: customer.address.city,
          state: customer.address.state,
          postal_code: customer.address.postalCode,
          country: "MX",
          residential: true,
        },
      },
      line_items: cart.items.map((item) => ({
        name: item.name,
        sku: item.id,
        unit_price: item.unitPrice,
        quantity: item.quantity,
      })),
      metadata: { integration: "Next.js Checkout Component", store: "Palestina" },
    }),
  });

  const data = (await response.json().catch(() => ({}))) as ConektaCheckoutResponse;
  if (!response.ok) throw new Error(`CONEKTA_CHECKOUT_FAILED_${response.status}`);

  const checkoutRequestId = typeof data.checkout?.id === "string" ? data.checkout.id : "";
  if (!checkoutRequestId) throw new Error("CONEKTA_CHECKOUT_ID_MISSING");

  return {
    checkoutRequestId,
    orderId: typeof data.id === "string" ? data.id : "",
    status: typeof data.checkout?.status === "string" ? data.checkout.status : "Issued",
  };
}
