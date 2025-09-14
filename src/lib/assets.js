export const ASSETS = [
  { symbol: "ETH", chains: { EVM: { kind: "native" }, Solana: null, Sui: null } },
  { symbol: "USDC", chains: { 
      EVM: { kind: "erc20", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }, 
      Solana: { kind: "spl", mint: "Es9vMFrzaCERz..." }, 
      Sui: { kind: "coin", type: "0x2::coin::USDC" } 
    } 
  },
  { symbol: "USDT", chains: { 
      EVM: { kind: "erc20", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" }, 
      Solana: { kind: "spl", mint: "BQhG7..." }, 
      Sui: { kind: "coin", type: "0x2::coin::USDT" } 
    } 
  },
  { symbol: "DAI", chains: { 
      EVM: { kind: "erc20", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" }, 
      Solana: null, 
      Sui: null 
    } 
  },
  { symbol: "SOL", chains: { EVM: null, Solana: { kind: "native" }, Sui: null } },
  { symbol: "SUI", chains: { EVM: null, Solana: null, Sui: { kind: "native" } } },
];

/**
 * Допоміжна функція для пошуку адреси токена
 */
export function resolveAssetAddress(chain, symbol) {
  const asset = ASSETS.find(a => a.symbol === symbol);
  if (!asset) return null;

  const entry = asset.chains?.[chain];
  if (!entry) return null;

  // повертаємо address/mint/type або "native"
  if (entry.kind === "native") return "native";
  return entry.address || entry.mint || entry.type || null;
}
