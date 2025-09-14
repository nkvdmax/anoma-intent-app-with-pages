export function canonicalizeIntent(raw) {
  // стабільний формат: відсортовані ключі, фіксовані типи
  const v = { version: '1.0.0',
    chain: String(raw.chain || ''),
    network: String(raw.network || ''),
    asset: String(raw.asset || ''),
    amount: String(raw.amount || ''),
    recipient: String(raw.recipient || ''),
    note: String(raw.note || ''),
    ts: Number(raw.ts || Date.now()),
  };
  // детерміноване сортування ключів
  const sorted = Object.fromEntries(Object.entries(v).sort(([a],[b]) => a.localeCompare(b)));
  return sorted;
}
export function utf8Bytes(s){ return new TextEncoder().encode(String(s)); }
export function hex(bytes){ return Array.from(bytes).map(b=>b.toString(16).padStart(2,'0')).join(''); }
export async function sha256Hex(data){
  const bytes = (data instanceof Uint8Array) ? data : utf8Bytes(data);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return hex(new Uint8Array(digest));
}
