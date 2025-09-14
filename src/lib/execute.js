/**
 * Execute layer for different chains.
 * EVM/Solana left as stubs (safe no-unicode, no failing throws).
 * SUI has a working minimal transfer using available wallet APIs.
 */

/* eslint-disable no-console */

//// ----- EVM (stub – keep or replace with your real flow) -----
export async function executeEvm(bundle, plan, network) {
  console.info("[executeEvm] stub called", { bundle, plan, network });
  // TODO: replace with real ethers v5 flow (ETH or ERC-20)
  return { stub: true };
}

//// ----- Solana (stub) -----
export async function executeSolana(bundle, plan, network) {
  console.info("[executeSolana] stub called", { bundle, plan, network });
  // TODO: replace with real @solana/web3.js flow
  return { stub: true };
}

//// ----- SUI (real minimal transfer) -----
/**
 * Tries several wallet APIs:
 *  - window.sui?.transferSui({ to, amount })
 *  - window.sui?.signAndExecuteTransaction / signAndExecuteTransactionBlock
 *  - window.suiWallet?.signAndExecuteTransaction
 *
 * Amount is treated as SUI (9 decimals). For token transfers extend with type arguments.
 */
export async function executeSui(bundle, plan, network) {
  const w = (typeof window !== "undefined") ? window : {};
  const hasSui   = !!w.sui;
  const hasWStd  = !!w.suiWallet;

  if (!hasSui && !hasWStd) {
    throw new Error("No Sui wallet detected (window.sui / window.suiWallet). Install Sui wallet extension.");
  }

  // derive recipient/amount from intent/plan
  const to = (bundle && bundle.intent && bundle.intent.recipient) ||
             (plan && Array.isArray(plan.steps) && plan.steps.find(s => s.chain === "Sui")?.to);

  const amountStr = (bundle && bundle.intent && bundle.intent.amount) ||
                    (plan && Array.isArray(plan.steps) && plan.steps.find(s => s.chain === "Sui")?.amount) || "0";

  if (!to) throw new Error("Missing Sui recipient");
  const amountNano = Math.round(parseFloat(String(amountStr)) * 1e9); // SUI has 9 decimals

  console.info("[executeSui] to:", to, "amount(nano):", amountNano, "network:", network || "mainnet");

  // 1) Easiest: native helper if wallet supports it
  try {
    if (hasSui && typeof w.sui.transferSui === "function") {
      const res = await w.sui.transferSui({ to, amount: String(amountNano) });
      console.info("[executeSui] via sui.transferSui =>", res);
      return res;
    }
  } catch (e) {
    console.warn("[executeSui] transferSui failed, will fallback.", e?.message || e);
  }

  // 2) Generic sign+execute (API names differ per wallet)
  const txMoveCall = {
    kind: "moveCall",
    data: {
      packageObjectId: "0x2",
      module: "sui",
      function: "transfer",
      typeArguments: ["0x2::sui::SUI"],
      arguments: [to, String(amountNano)],
      gasBudget: 100000, // tweak if needed
    },
  };

  // newer wallets expose signAndExecuteTransactionBlock; older — signAndExecuteTransaction
  const trySui = async () => {
    if (!hasSui) return null;
    const api = w.sui;
    if (typeof api.signAndExecuteTransactionBlock === "function") {
      return await api.signAndExecuteTransactionBlock({ transactionBlock: txMoveCall });
    }
    if (typeof api.signAndExecuteTransaction === "function") {
      return await api.signAndExecuteTransaction({ transaction: txMoveCall });
    }
    return null;
  };

  const tryWStd = async () => {
    if (!hasWStd) return null;
    const api = w.suiWallet;
    if (typeof api.signAndExecuteTransaction === "function") {
      return await api.signAndExecuteTransaction({ transaction: txMoveCall });
    }
    if (typeof api.signAndExecuteTransactionBlock === "function") {
      return await api.signAndExecuteTransactionBlock({ transactionBlock: txMoveCall });
    }
    return null;
  };

  const res1 = await trySui();
  if (res1) { console.info("[executeSui] via window.sui =>", res1); return res1; }

  const res2 = await tryWStd();
  if (res2) { console.info("[executeSui] via window.suiWallet =>", res2); return res2; }

  throw new Error("Sui wallet does not expose a compatible sign+execute API.");
}
