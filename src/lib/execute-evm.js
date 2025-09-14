import { ethers } from "ethers";

const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 value) returns (bool)"
];

export const EVM_CHAIN_IDS = {
  "Ethereum Main": "0x1",
  "Arbitrum One": "0xa4b1",
  "Polygon": "0x89",
  "Base": "0x2105",
};

export async function executeEvmStep(step, bundle, networkName) {
  if (!window.ethereum) throw new Error("No EVM wallet injected");
  if (!step?.action) throw new Error("Bad plan step");
  if (step.action !== "transfer") throw new Error(\Unsupported action: \\);

  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  const signer = provider.getSigner();

  const wantChainIdHex = EVM_CHAIN_IDS[networkName] || EVM_CHAIN_IDS["Ethereum Main"];
  const current = await provider.getNetwork();
  if (!current || ("0x" + current.chainId.toString(16)) !== wantChainIdHex) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: wantChainIdHex }],
      });
    } catch (e) {
      throw new Error(\Wrong network. Please switch to \.\);
    }
  }

  const to = ethers.utils.getAddress(step.to);
  const assetAddress = bundle?.resolvedAsset?.address;
  const isNative =
    !assetAddress ||
    assetAddress === "native" ||
    assetAddress === "0x0000000000000000000000000000000000000000";

  let tx;
  if (isNative || step.asset.toUpperCase() === "ETH") {
    const value = ethers.utils.parseEther(String(step.amount));
    const txReq = { to, value };
    const gas = await signer.estimateGas(txReq).catch(() => null);
    if (gas) txReq.gasLimit = gas.mul(120).div(100);
    tx = await signer.sendTransaction(txReq);
  } else {
    if (!ethers.utils.isAddress(assetAddress)) {
      throw new Error("Token address not resolved");
    }
    const token = new ethers.Contract(assetAddress, ERC20_ABI, signer);
    let decimals = 18;
    try { decimals = await token.decimals(); } catch {}
    const amount = ethers.utils.parseUnits(String(step.amount), decimals);
    const iface = new ethers.utils.Interface(ERC20_ABI);
    const data = iface.encodeFunctionData("transfer", [to, amount]);
    const txReq = { to: assetAddress, data, value: 0 };
    const gas = await signer.estimateGas(txReq).catch(() => null);
    if (gas) txReq.gasLimit = gas.mul(120).div(100);
    tx = await signer.sendTransaction(txReq);
  }

  const receipt = await tx.wait(1);
  return {
    chain: "EVM",
    hash: tx.hash,
    blockNumber: receipt.blockNumber,
    to,
    asset: step.asset,
    amount: step.amount,
    native: isNative,
  };
}
