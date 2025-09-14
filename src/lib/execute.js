import { toast } from "sonner";
import { ethers } from "ethers";

/**
 * Execute plan per chain.
 * For demo: реалізований EVM transfer (ETH/ERC-20), Solana/Sui — заглушки.
 *
 * @param {object} bundle  — підписаний бандл/інтент
 * @param {object|null} plan — план від Solver
 * @param {string} network  — "Ethereum Main" | "Arbitrum" | "Polygon" | "Base" | ...
 */
export async function execute(bundle, plan, network) {
  const chain = bundle?.intent?.chain;
  if (chain === "EVM") return await executeEvm(bundle, plan, network);
  if (chain === "Solana") throw new Error("Solana execute not implemented yet");
  if (chain === "Sui") throw new Error("Sui execute not implemented yet");
  throw new Error("Unsupported chain");
}

/** ----------- EVM ------------- **/
async function executeEvm(bundle, plan, network) {
  if (!window.ethereum) throw new Error("No EVM wallet (window.ethereum) detected");

  // План може містити покроковий маршрут; для демо візьмемо перший transfer step
  const step = Array.isArray(plan?.steps) ? plan.steps.find(s => s.chain === "EVM") : null;

  // Дані з інтенту
  const asset   = bundle?.intent?.asset || step?.asset || "ETH";
  const amountS = bundle?.intent?.amount || step?.amount || "0";
  const to      = bundle?.intent?.recipient || step?.to;
  if (!to) throw new Error("Missing EVM recipient");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer   = await provider.getSigner();

  if (asset.toUpperCase() === "ETH") {
    // native transfer
    const tx = await signer.sendTransaction({
      to,
      value: ethers.parseEther(amountS)
    });
    const receipt = await tx.wait();
    toast.success(`Executed on ${network}: ${receipt.hash.slice(0, 10)}…`);
    return receipt;
  }

  // ERC-20 transfer
  const token = await resolveErc20Address(asset, network);
  const erc20 = new ethers.Contract(
    token,
    ["function transfer(address to,uint256 amount) returns (bool)"],
    signer
  );
  const decimals = await getDecimals(erc20);
  const amount = ethers.parseUnits(amountS, decimals);
  const tx = await erc20.transfer(to, amount);
  const receipt = await tx.wait();
  toast.success(`Executed on ${network}: ${receipt.hash.slice(0, 10)}…`);
  return receipt;
}

async function getDecimals(erc20) {
  try {
    const abi = ["function decimals() view returns (uint8)"];
    const c = new ethers.Contract(erc20.target, abi, erc20.runner);
    return await c.decimals();
  } catch {
    return 18; // дефолт
  }
}

// Спрощений резолвер адрес токенів (використай свій src/lib/assets.js, якщо є)
async function resolveErc20Address(symbol, network) {
  const map = {
    "Ethereum Main": {
      USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      DAI:  "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    }
  };
  const addr = map[network]?.[symbol.toUpperCase()];
  if (!addr) throw new Error(`Unknown token ${symbol} on ${network}`);
  return addr;
}
