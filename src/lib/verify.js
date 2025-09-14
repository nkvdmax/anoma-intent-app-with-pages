import { verifyMessage } from "viem";
import * as ed25519 from "@noble/ed25519";
import { toHex } from "./utils.js";

/**
 * bundle = { intent, hash, sig, scheme, meta }
 * scheme:
 *   { type: "evm", encoding:"hex" }
 *   { type: "solana", encoding:"base64" }
 * meta:
 *   { from } for EVM
 *   { pubkeyB64 } for Solana
 */
export async function verifyBundle(bundle) {
  const type = bundle?.scheme?.type;
  if (type === "evm") return verifyEvm(bundle);
  if (type === "solana") return verifySolana(bundle);
  return { ok:false, reason:"Unsupported scheme for verification (sui not implemented yet)" };
}

async function verifyEvm(bundle) {
  const { sig, meta } = bundle || {};
  const from = meta?.from;
  const msg = "anoma-intent:" + bundle.hash;
  if (!from || !sig) return { ok:false, reason:"Missing from or signature" };
  try {
    const ok = await verifyMessage({ address: from, message: msg, signature: sig });
    return ok ? { ok:true } : { ok:false, reason:"verifyMessage returned false" };
  } catch (e) {
    return { ok:false, reason:e?.message || "EVM verify failed" };
  }
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

async function verifySolana(bundle) {
  const { sig, meta } = bundle || {};
  const pubkeyB64 = meta?.pubkeyB64;
  if (!pubkeyB64 || !sig) return { ok:false, reason:"Missing pubkey or signature" };
  try {
    const pk = b64ToBytes(pubkeyB64);
    let sigBytes;
    // sig може бути base64 або Uint8Array, нормал≥зуЇмо:
    if (typeof sig === "string") {
      if (sig.startsWith("0x")) {
        // не оч≥кувано дл€ sol Ч перетворимо гекс у байти на вс€к випадок
        const hex = sig.slice(2);
        const out = new Uint8Array(hex.length/2);
        for (let i=0;i<out.length;i++) out[i] = parseInt(hex.slice(2*i,2*i+2),16);
        sigBytes = out;
      } else {
        sigBytes = b64ToBytes(sig);
      }
    } else if (sig?.length) {
      sigBytes = sig;
    } else {
      return { ok:false, reason:"Unsupported signature format" };
    }
    const msg = new TextEncoder().encode("anoma-intent:" + bundle.hash);
    const ok = await ed25519.verify(sigBytes, msg, pk);
    return ok ? { ok:true } : { ok:false, reason:"ed25519 verify returned false" };
  } catch (e) {
    return { ok:false, reason:e?.message || "Solana verify failed" };
  }
}
