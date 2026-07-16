import assert from "node:assert/strict";
import { generateKeyPairSync, sign } from "node:crypto";
import test from "node:test";
import { normalizeWebhookDigest, verifyWebhook } from "./conekta-webhook";

test("verifica una firma RSA-SHA256 Base64 sobre el payload UTF-8 original", () => {
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const payload = '{"type":"webhook.created","livemode":true,"mensaje":"México"}';
  const digest = sign("RSA-SHA256", Buffer.from(payload, "utf8"), privateKey).toString("base64");
  const publicKeyPem = publicKey.export({ type: "spki", format: "pem" }).toString();

  assert.equal(verifyWebhook(payload, digest, publicKeyPem), true);
  assert.equal(verifyWebhook(payload.replace("México", "Mexico"), digest, publicKeyPem), false);
});

test("normaliza Base64 puro o entre comillas y rechaza formatos no documentados", () => {
  const base64 = Buffer.from("firma").toString("base64");
  assert.deepEqual(normalizeWebhookDigest(base64), { signature: base64, format: "base64" });
  assert.deepEqual(normalizeWebhookDigest(` "${base64}" `), { signature: base64, format: "quoted-base64" });
  assert.deepEqual(normalizeWebhookDigest(`sha256=${base64}`), { signature: "", format: "invalid" });
});
