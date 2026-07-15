import { createPublicKey, verify } from "node:crypto";

type State = { status: string; updatedAt: number };
export type WebhookEvent = { id?: string; type?: string; livemode?: boolean; data?: { object?: Record<string, unknown> } };
export type WebhookDiagnostic = {
  digest_present: boolean;
  public_key_present: boolean;
  public_key_format_valid: boolean;
  signature_valid: boolean;
  event_type: string | null;
  livemode: boolean | null;
  body_length: number;
};
const store = globalThis as typeof globalThis & { __conektaEvents?: Map<string, State>; __conektaOrders?: Map<string, State> };
const processedEvents = store.__conektaEvents ??= new Map();
const orderStates = store.__conektaOrders ??= new Map();

export function normalizeWebhookPublicKey(value: string | undefined) {
  const normalized = value?.replace(/\\n/g, "\n").trim() ?? "";
  const formatValid = normalized.startsWith("-----BEGIN PUBLIC KEY-----") && normalized.endsWith("-----END PUBLIC KEY-----");
  return { normalized, present: normalized.length > 0, formatValid };
}

export function verifyWebhook(rawBody: string, digest: string, publicKeyPem: string) {
  try {
    return verify(
      "RSA-SHA256",
      Buffer.from(rawBody, "utf8"),
      createPublicKey(publicKeyPem),
      Buffer.from(digest, "base64"),
    );
  } catch {
    return false;
  }
}

export function parseWebhookEvent(rawBody: string): WebhookEvent | null {
  try {
    const parsed: unknown = JSON.parse(rawBody);
    return parsed && typeof parsed === "object" ? parsed as WebhookEvent : null;
  } catch {
    return null;
  }
}

export function logWebhookDiagnostic(diagnostic: WebhookDiagnostic) {
  console.info("Conekta webhook signature diagnostic", diagnostic);
}

export function processWebhookEvent(event: WebhookEvent) {
  if (!event.id || !event.type || processedEvents.has(event.id)) return;
  const object = event.data?.object;
  const orderId = typeof object?.order_id === "string" ? object.order_id : typeof object?.id === "string" && event.type.startsWith("order.") ? object.id : "";
  const statuses: Record<string, string> = { "charge.paid": "paid", "order.paid": "paid", "charge.declined": "declined", "order.declined": "declined", "charge.pending_confirmation": "pending", "order.pending_payment": "pending", "charge.refunded": "refunded", "order.refunded": "refunded" };
  const status = statuses[event.type];
  if (status && orderId) orderStates.set(orderId, { status, updatedAt: Date.now() });
  processedEvents.set(event.id, { status: status || "ignored", updatedAt: Date.now() });
  console.info("Conekta webhook procesado", { eventId: event.id, type: event.type, orderId, status: status || "ignored" });
}
