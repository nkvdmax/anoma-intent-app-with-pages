import * as ed25519 from "@noble/ed25519";

// прості утиліти перетворення, щоб не тягнути додаткові пакети
const hexToBytes = (hex) =>
  typeof hex === "string"
    ? Uint8Array.from((hex.startsWith("0x") ? hex.slice(2) : hex).match(/.{1,2}/g).map(b => parseInt(b, 16)))
    : hex;

const bytes = (x) =>
  typeof x === "string" ? new TextEncoder().encode(x) : x;

/**
 * Verify Ed25519 signature
 * @param {string|Uint8Array} publicKey - hex string (32 bytes) or Uint8Array
 * @param {string|Uint8Array} message   - utf-8 string or Uint8Array
 * @param {string|Uint8Array} signature - hex string (64 bytes) or Uint8Array
 * @returns {Promise<boolean>}
 */
export async function verifyEd25519(publicKey, message, signature) {
  const pk  = hexToBytes(publicKey);
  const sig = hexToBytes(signature);
  const msg = bytes(message);
  return ed25519.verify(sig, msg, pk);
}
