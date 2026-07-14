import { getProductById } from "@/lib/products";

export const MAX_ITEM_QUANTITY = 10;
export type CustomerInput = { name: string; email: string; phone: string; address: { street: string; city: string; state: string; postalCode: string } };

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.replace(/[<>\u0000-\u001f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max) : "";
}

export function validateCustomer(value: unknown): CustomerInput | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const rawAddress = input.address && typeof input.address === "object" ? input.address as Record<string, unknown> : {};
  const customer: CustomerInput = {
    name: clean(input.name, 120), email: clean(input.email, 160).toLowerCase(), phone: clean(input.phone, 25),
    address: { street: clean(rawAddress.street, 180), city: clean(rawAddress.city, 80), state: clean(rawAddress.state, 80), postalCode: clean(rawAddress.postalCode, 10) },
  };
  if (customer.name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || !/^\+?[0-9 ()-]{10,20}$/.test(customer.phone) || customer.address.street.length < 5 || customer.address.city.length < 2 || customer.address.state.length < 2 || !/^\d{5}$/.test(customer.address.postalCode)) return null;
  return customer;
}

export function buildServerCart(value: unknown) {
  if (!Array.isArray(value) || value.length === 0 || value.length > 30) return null;
  const seen = new Set<string>();
  const items = [];
  for (const raw of value) {
    if (!raw || typeof raw !== "object") return null;
    const { id, quantity } = raw as { id?: unknown; quantity?: unknown };
    if (typeof id !== "string" || seen.has(id) || !Number.isInteger(quantity) || (quantity as number) < 1 || (quantity as number) > MAX_ITEM_QUANTITY) return null;
    const product = getProductById(id);
    if (!product) return null;
    seen.add(id);
    items.push({ id: product.id, name: product.name, unitPrice: Math.round(product.price * 100), quantity: quantity as number });
  }
  return { items, total: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) };
}
