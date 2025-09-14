import { canonicalJSONStringify } from "./utils.js";

export const INTENT_VERSION = "0.1";

/** Мінімальна валідація нашого "transfer" інтента */
export function validateIntent(i) {
  if (!i || typeof i !== "object") throw new Error("Intent must be object");
  if (i.v !== INTENT_VERSION) throw new Error("Unsupported intent version");
  if (i.type !== "transfer") throw new Error("Only transfer intents are supported");
  if (!i.chain || !["evm","solana","sui"].includes(i.chain)) throw new Error("chain must be evm|solana|sui");
  if (!i.asset || typeof i.asset !== "string") throw new Error("asset is required");
  if (!i.amount || typeof i.amount !== "string") throw new Error("amount is required (as string)");
  if (!i.to || typeof i.to !== "string") throw new Error("to is required");
  if (!i.ts || typeof i.ts !== "number") throw new Error("ts is required");
  if (!i.nonce || typeof i.nonce !== "string") throw new Error("nonce is required");
  return true;
}

/** Конструктор інтента */
export function makeIntent({ chain, asset, amount, to }) {
  const intent = {
    v: INTENT_VERSION,
    type: "transfer",
    chain,
    asset,
    amount,
    to,
    ts: Date.now(),
    nonce: crypto.getRandomValues(new Uint32Array(2)).join("-"),
  };
  validateIntent(intent);
  return intent;
}

/** Хеш інтента (SHA-256 від канонічного JSON) */
export async function hashIntent(intent) {
  validateIntent(intent);
  const text = canonicalJSONStringify(intent);
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(digest);
}
