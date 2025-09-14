/**
 * Minimal networks inventory for selector.
 * For tokens: addresses per chain+network (ERC20 / SPL / Sui coinType).
 * NOTE: extend as needed.
 */
export const NETWORKS = [
  { id:"eth-mainnet", chain:"EVM", name:"Ethereum Mainnet", rpc:"" },
  { id:"arb-mainnet", chain:"EVM", name:"Arbitrum One", rpc:"" },
  { id:"poly-mainnet", chain:"EVM", name:"Polygon", rpc:"" },
  { id:"base-mainnet", chain:"EVM", name:"Base", rpc:"" },

  { id:"sol-mainnet", chain:"Solana", name:"Solana Mainnet", rpc:"" },
  { id:"sol-devnet", chain:"Solana", name:"Solana Devnet", rpc:"" },

  { id:"sui-mainnet", chain:"Sui", name:"Sui Mainnet", rpc:"" },
  { id:"sui-testnet", chain:"Sui", name:"Sui Testnet", rpc:"" },
];

export const ASSETS = [
  // EVM (ERC20/native)
  { symbol:"ETH", chain:"EVM", networks:{ "eth-mainnet": {address:"native"} } },
  { symbol:"USDC", chain:"EVM", networks:{
      "eth-mainnet": {address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},
      "arb-mainnet": {address:"0xaf88d065e77c8cC2239327C5EDb3A432268e5831"},
      "poly-mainnet": {address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"},
      "base-mainnet": {address:"0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}
  }},
  { symbol:"USDT", chain:"EVM", networks:{
      "eth-mainnet": {address:"0xdAC17F958D2ee523a2206206994597C13D831ec7"},
      "arb-mainnet": {address:"0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"},
      "poly-mainnet": {address:"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"}
  }},
  { symbol:"DAI", chain:"EVM", networks:{
      "eth-mainnet": {address:"0x6B175474E89094C44Da98b954EedeAC495271d0F"},
      "arb-mainnet": {address:"0xda10009cbd5d07dd0cecc66161fc93d7c9000da1"},
      "poly-mainnet": {address:"0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"}
  }},

  // Solana (SPL)
  { symbol:"SOL", chain:"Solana", networks:{ "sol-mainnet": {mint:"native"} , "sol-devnet": {mint:"native"} } },
  { symbol:"USDC", chain:"Solana", networks:{
      "sol-mainnet": {mint:"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"},
      "sol-devnet": {mint:"Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"}
  }},
  { symbol:"USDT", chain:"Solana", networks:{
      "sol-mainnet": {mint:"Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"}
  }},
  { symbol:"DAI", chain:"Solana", networks:{
      "sol-mainnet": {mint:"6o1Q5G...demo"} // placeholder; replace if needed
  }},

  // Sui
  { symbol:"SUI", chain:"Sui", networks:{ "sui-mainnet": {coinType:"0x2::sui::SUI"}, "sui-testnet": {coinType:"0x2::sui::SUI"} } },
  { symbol:"USDC", chain:"Sui", networks:{
      "sui-mainnet": {coinType:"0x8ac...::usdc::USDC"},  // placeholder demo
      "sui-testnet": {coinType:"0x5e1...::usdc::USDC"}   // placeholder demo
  }},
  { symbol:"USDT", chain:"Sui", networks:{
      "sui-mainnet": {coinType:"0xabc...::usdt::USDT"}   // placeholder demo
  }},
  { symbol:"DAI", chain:"Sui", networks:{
      "sui-mainnet": {coinType:"0xdef...::dai::DAI"}     // placeholder demo
  }},
];

/** helpers */
export function assetsFor(chain){ return ASSETS.filter(a => a.chain === chain); }
export function resolveAssetAddress(chainId, symbol){
  const a = ASSETS.find(x=>x.symbol===symbol);
  if(!a) return null;
  return a.networks?.[chainId] || null;
}
