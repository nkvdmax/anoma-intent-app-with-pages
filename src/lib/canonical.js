/**
 * Canonicalize + SHA-256 via Web Crypto (works in browser & GH Pages).
 */

function canonicalize(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(canonicalize);
  const out = {};
  for (const k of Object.keys(obj).sort()) out[k] = canonicalize(obj[k]);
  return out;
}

function encUtf8(str) { return new TextEncoder().encode(str); }
function toHex(u8) { let s = ""; for (let i = 0; i < u8.length; i++) s += u8[i].toString(16).padStart(2,"0"); return s; }

/** SHA-256 of canonical JSON, hex */
export async function canonicalHash(obj) {
  const json = JSON.stringify(canonicalize(obj));
  const bytes = encUtf8(json);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return toHex(new Uint8Array(digest));
}

/** Build canonical intent + deterministic id */
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
