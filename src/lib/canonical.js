import { createHash } from "crypto";

/**
 * Детерміноване сортування ключів і серіалізація
 */
export function canonicalize(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  return Object.keys(obj).sort().reduce((res, key) => {
    res[key] = canonicalize(obj[key]);
    return res;
  }, {});
}

/**
 * Створює SHA-256 хеш з канонічного JSON
 */
export function canonicalHash(obj) {
  const canon = canonicalize(obj);
  const json = JSON.stringify(canon);
  return createHash("sha256").update(json).digest("hex");
}

/**
 * Допоміжне: будує канонічний інтент
 */
export function makeCanonicalIntent(intent) {
  return {
    ...intent,
    id: canonicalHash({
      chain: intent.chain,
      asset: intent.asset,
      amount: intent.amount,
      recipient: intent.recipient,
      note: intent.note || "",
    }),
  };
}
