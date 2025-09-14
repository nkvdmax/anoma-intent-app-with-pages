/** EVM execute: transfer or route-defined calldata (simplified demo) */
export async function executeEvm(plan){
  if(!window.ethereum) throw new Error("No EVM provider");
  const step = plan.routes?.[0];
  if(!step) throw new Error("Empty plan");
  // Minimal: native transfer
  if(step.asset === "ETH" && step.to && step.amount){
    const valueWei = "0x"+Math.floor(Number(step.amount)*1e18).toString(16);
    const [from] = await window.ethereum.request({ method:"eth_requestAccounts" });
    const tx = { from, to: step.to, value: valueWei };
    const gas = await window.ethereum.request({ method:"eth_estimateGas", params:[tx] }).catch(()=> null);
    if(gas) tx.gas = gas;
    const hash = await window.ethereum.request({ method:"eth_sendTransaction", params:[tx] });
    return { chain:"EVM", txHash: hash };
  }
  // For ERC20 or complex calldata – extend here
  throw new Error("Demo execute only supports ETH transfer");
}

/** Solana execute (demo): requires wallet with signAndSendTransaction */
export async function executeSolana(plan){
  if(!window.solana?.signAndSendTransaction) throw new Error("No Solana wallet");
  // Build a minimal SystemProgram.transfer here (omitted for brevity)
  throw new Error("Demo: implement SPL/native transfer build");
}

/** Sui execute (demo) */
export async function executeSui(plan){
  if(!window.sui?.signAndExecuteTransaction || !window.sui?.request) throw new Error("No Sui wallet");
  // Build a minimal paySui transaction here (omitted for brevity)
  throw new Error("Demo: implement Sui transfer build");
}
