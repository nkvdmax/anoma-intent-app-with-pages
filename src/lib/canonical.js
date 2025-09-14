/**
 * Канонізація (стабільне сортування ключів) + SHA-256 через Web Crypto.
 * Працює в браузері й у CI без node:crypto.
 */

function canonicalize(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  return Object.keys(obj).sort().reduce((acc, k) => {
    acc[k] = canonicalize(obj[k]);
    return acc;
  }, {});
}

function encUtf8(str) {
  return new TextEncoder().encode(str);
}

function toHex(u8) {
  let out = "";
  for (let i = 0; i < u8.length; i++) out += u8[i].toString(16).padStart(2, "0");
  return out;
}

/** Повертає hex-рядок SHA-256 від канонічного JSON */
export async function canonicalHash(obj) {
  const json = JSON.stringify(canonicalize(obj));
  const bytes = encUtf8(json);
  const digest = await (globalThis.crypto?.subtle?.digest("SHA-256", bytes));
  if (!digest) throw new Error("Web Crypto not available");
  return toHex(new Uint8Array(digest));
}

/** Збирає канонічний інтент і додає детермінований id */
export async function makeCanonicalIntent(intent) {
  const id = await canonicalHash({
    chain: intent.chain,
    asset: intent.asset,
    amount: intent.amount,
    recipient: intent.recipient,
    note: intent.note ?? "",
  });
  return { ...intent, id };
}
