export const ASSETS = [
  { symbol: "ETH", name: "Ether",    coingeckoId: "ethereum", type: "native" },
  { symbol: "USDC", name: "USD Coin", coingeckoId: "usd-coin" },
  { symbol: "USDT", name: "Tether",   coingeckoId: "tether" },
  { symbol: "DAI",  name: "Dai",      coingeckoId: "dai" },

  { symbol: "SOL",  name: "Solana",   coingeckoId: "solana",  type: "native" },
  { symbol: "SUI",  name: "Sui",      coingeckoId: "sui",     type: "native" },
];

const HARDENED = {
  EVM: {
    ETH:  { kind: "native", address: null },
    USDC: { kind: "erc20",  address: "0xA0b86991c6218B36c1d19D4a2e9Eb0cE3606eb48" },
    USDT: { kind: "erc20",  address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
    DAI:  { kind: "erc20",  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
    SOL:  null,
    SUI:  null,
  },
  Solana: {
    SOL:  { kind: "native", address: "So11111111111111111111111111111111111111112" },
    USDC: { kind: "spl",    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" },
    USDT: { kind: "spl",    address: "Es9vMFrzaCERmJfrF4H2FYD4Y3vDqgW8sELpAo7P5uAA" },
    DAI:  null, ETH: null, SUI: null,
  },
  Sui: {
    SUI:  { kind: "native", address: null },
    ETH: null, USDC: null, USDT: null, DAI: null, SOL: null,
  },
};

const COINGECKO_PLATFORM = { EVM: "ethereum", Solana: "solana", Sui: "sui" };

export async function resolveAssetAddress(chain, assetSymbol) {
  const hardened = HARDENED?.[chain]?.[assetSymbol] || null;
  if (hardened && (hardened.kind === "native" || hardened.address)) {
    return { ...hardened, source: "hardcoded" };
  }
  const meta = ASSETS.find(a => a.symbol === assetSymbol);
  const platform = COINGECKO_PLATFORM[chain];
  if (!meta || !platform) return { kind: "unknown", address: null, source: "none" };
  try {
    const res = await fetch(https://api.coingecko.com/api/v3/coins/\);
    if (!res.ok) throw new Error(CoinGecko \);
    const json = await res.json();
    const addr = json?.platforms?.[platform] || null;
    if (!addr) return { kind: "unknown", address: null, source: "coingecko" };
    let kind = "token";
    if (chain === "EVM") kind = "erc20";
    if (chain === "Solana") kind = "spl";
    if (chain === "Sui") kind = "coinType";
    return { kind, address: addr, source: "coingecko" };
  } catch (e) {
    console.warn("resolveAssetAddress failed:", e);
    return { kind: "unknown", address: null, source: "error" };
  }
}
