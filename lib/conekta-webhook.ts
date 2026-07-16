import { createPublicKey, createVerify } from "node:crypto";

type State = { status: string; updatedAt: number };
export type WebhookEvent = { id?: string; type?: string; livemode?: boolean; data?: { object?: Record<string, unknown> } };
export type WebhookDiagnostic = {
  digest_present: boolean;
  digest_format: DigestFormat;
  public_key_present: boolean;
  public_key_format_valid: boolean;
  signature_valid: boolean;
  event_type: string | null;
  livemode: boolean | null;
  body_length: number;
};
export type DigestFormat = "missing" | "base64" | "quoted-base64" | "invalid";
const store = globalThis as typeof globalThis & { __conektaEvents?: Map<string, State>; __conektaOrders?: Map<string, State> };
const processedEvents = store.__conektaEvents ??= new Map();
const orderStates = store.__conektaOrders ??= new Map();

export function normalizeWebhookPublicKey(value: string | undefined) {
  const normalized = value?.replace(/\\n/g, "\n").trim() ?? "";
  const formatValid = normalized.startsWith("-----BEGIN PUBLIC KEY-----") && normalized.endsWith("-----END PUBLIC KEY-----");
  return { normalized, present: normalized.length > 0, formatValid };
}

export function normalizeWebhookDigest(value: string | null) {
  if (value === null || value.trim() === "") {
    return { signature: "", format: "missing" as const };
  }

  const trimmed = value.trim();
  const quoted = (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"));
  const signature = quoted ? trimmed.slice(1, -1).trim() : trimmed;
  const validBase64 = signature.length > 0 &&
    signature.length % 4 === 0 &&
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(signature);

  return {
    signature: validBase64 ? signature : "",
    format: validBase64 ? (quoted ? "quoted-base64" as const : "base64" as const) : "invalid" as const,
  };
}

export function verifyWebhook(rawBody: string, digestBase64: string, publicKeyPem: string) {
  try {
    const verifier = createVerify("RSA-SHA256");
    verifier.update(rawBody, "utf8");
    verifier.end();
    return verifier.verify(createPublicKey(publicKeyPem), digestBase64, "base64");
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
