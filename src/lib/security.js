export function sanitizeRecipient(str){
  return String(str||"").trim();
}

export function isPositiveAmount(x){
  const n = Number(x);
  return Number.isFinite(n) && n > 0;
}

/** allowlist example (extend per chain/network/asset) */
export const ALLOWLIST = {
  "EVM:eth-mainnet:USDC": true,
  "EVM:eth-mainnet:USDT": true,
  "EVM:eth-mainnet:DAI": true,
};

export function isAllowed({chain, network, asset}){
  const key = `${chain}:${network}:${asset}`;
  return !!ALLOWLIST[key] || asset === "ETH" || asset === "SOL" || asset === "SUI";
}

/** very basic recipient validators; extend ENS/SNS lookup here */
export function validRecipient(chain, value){
  const s = String(value||"").trim();
  if(chain==="EVM")  return /^0x[0-9a-fA-F]{40}$/.test(s);
  if(chain==="Solana")return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(s); // base58 length range
  if(chain==="Sui")   return /^0x[0-9a-fA-F]{40,64}$/.test(s);
  return false;
}
