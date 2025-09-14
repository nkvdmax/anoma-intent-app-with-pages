/** Very simple mock solver */
export async function mockSolve(bundle) {
  // emulate network latency
  await new Promise(r => setTimeout(r, 400));
  return {
    ok: true,
    solutionId: crypto.randomUUID(),
    receivedHash: bundle.hash,
    route: ["client", "solver"],
    // echo back minimal “plan”
    plan: { action: "transfer", chain: bundle?.intent?.chain, to: bundle?.intent?.to, amount: bundle?.intent?.amount, asset: bundle?.intent?.asset },
  };
}

/** Very simple mock relayer */
export async function mockRelay(solution) {
  await new Promise(r => setTimeout(r, 400));
  return {
    ok: true,
    dryRun: true,
    // pretend we built tx payload
    txPayload: "0x" + Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2,"0")).join(""),
    route: ["client", "relayer"],
    solutionId: solution.solutionId,
  };
}
