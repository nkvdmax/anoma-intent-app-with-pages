import * as ed from "@noble/ed25519";

/**
 * Verify a bundle { sig, msg, pk }:
 *  - sig: Uint8Array або hex-рядок ("0x..." або без префікса)
 *  - pk : Uint8Array або hex-рядок
 *  - msg: звичайний рядок (UTF-8)
 * Повертає Promise<boolean>.
 */
export async function verifyBundle({ sig, msg, pk }) {
  const hexToBytes = (hex) => {
    const h = hex.startsWith("0x") ? hex.slice(2) : hex;
    if (h.length % 2 !== 0) throw new Error("Invalid hex");
    const arr = new Uint8Array(h.length / 2);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = parseInt(h.substr(i * 2, 2), 16);
    }
    return arr;
  };

  const toBytes = (v) => (typeof v === "string" ? hexToBytes(v) : v);

  const sigBytes = toBytes(sig);
  const pkBytes  = toBytes(pk);
  const msgBytes = new TextEncoder().encode(msg);

  return await ed.verify(sigBytes, msgBytes, pkBytes);
}
