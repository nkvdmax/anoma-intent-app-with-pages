export function isPositiveAmount(x) {
  if (typeof x !== 'string') return false;
  const n = Number(x);
  return Number.isFinite(n) && n > 0;
}

export function isEvmAddress(x) {
  return /^0x[a-fA-F0-9]{40}$/.test(x || '');
}

// Дуже спрощено: Solana base58 (32–44), без глибокої перевірки checksum
export function isSolAddress(x) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(x || '');
}

// Спрощено для Sui: 0x + 64 hex
export function isSuiAddress(x) {
  return /^0x[a-fA-F0-9]{64}$/.test(x || '');
}

export function validRecipient(chain, addr) {
  if (!addr) return false;
  if (chain === 'EVM') return isEvmAddress(addr);
  if (chain === 'Solana') return isSolAddress(addr);
  if (chain === 'Sui') return isSuiAddress(addr);
  return false;
}
