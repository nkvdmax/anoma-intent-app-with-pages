import { toast } from "sonner";
import { ethers } from "ethers";

/**
 * Загальний роутер виконання: за chain викликає відповідну реалізацію.
 */
export async function execute(bundle, plan, network) {
  const chain = bundle?.intent?.chain;
  if (chain === "EVM")   return executeEvm(bundle, plan, network);
  if (chain === "Solana") return executeSolana(bundle, plan, network);
  if (chain === "Sui")    return executeSui(bundle, plan, network);
  throw new Error("Unsupported chain");
}

/** ---------------- EVM (ETH/ERC-20) ---------------- */
export async function executeEvm(bundle, plan, network) {
  if (!window.ethereum) throw new Error("No EVM wallet (window.ethereum) detected");

  // крок із плану (демо: беремо перший EVM transfer)
  const step = Array.isArray(plan?.steps) ? plan.steps.find(s => s.chain === "EVM") : null;

  // дані з інтенту як пріоритетні
  const asset   = (bundle?.intent?.asset || step?.asset || "ETH").toUpperCase();
  const amountS = bundle?.intent?.amount || step?.amount || "0";
  const to      = bundle?.intent?.recipient || step?.to;
  if (!to) throw new Error("Missing EVM recipient");

  // ethers v5: Web3Provider + utils.parse*
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer   = provider.getSigner();

  if (asset === "ETH") {
    const tx = await signer.sendTransaction({
      to,
      value: ethers.utils.parseEther(amountS),
    });
    const receipt = await tx.wait();
    toast.success(`Executed on ${network}: ${receipt.transactionHash.slice(0,10)}…`);
    return receipt;
  }

  // ERC-20
  const tokenAddress = await resolveErc20Address(asset, network);
  const erc20 = new ethers.Contract(
    tokenAddress,
    ["function transfer(address to,uint256 amount) returns (bool)",
     "function decimals() view returns (uint8)"],
    signer
  );
  let decimals = 18;
  try { decimals = await erc20.decimals(); } catch {}
  const amount = ethers.utils.parseUnits(amountS, decimals);
  const tx = await erc20.transfer(to, amount);
  const receipt = await tx.wait();
  toast.success(`Executed on ${network}: ${receipt.transactionHash.slice(0,10)}…`);
  return receipt;
}

/** Мапа адрес токенів (спрощено). За потреби злий із src/lib/assets.js */
async function resolveErc20Address(symbol, network) {
  const map = {
    "Ethereum Main": {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      DAI:  "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    },
    // додай інші мережі за потреби…
  };
  const addr = map[network]?.[symbol];
  if (!addr) throw new Error(`Unknown token ${symbol} on ${network}`);
  return addr;
}

/** ---------------- Заглушки для Solana/Sui ---------------- */
export async function executeSolana(_bundle, _plan, _network) {
  throw new Error("Solana execute not implemented yet");
}
export async function executeSui(_bundle, _plan, _network) {
  throw new Error("Sui execute not implemented yet");
}

export default execute;
