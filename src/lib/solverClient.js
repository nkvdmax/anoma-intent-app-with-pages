import { canonicalHash, makeCanonicalIntent } from './canonical.js';

const SOLVER_URL = import.meta.env.VITE_SOLVER_URL || '';

export async function solveIntent(rawBundle) {
  const payload = { bundle: rawBundle };
  if (!SOLVER_URL) return mockSolve(payload);

  const r = await fetch(SOLVER_URL.replace(/\/+$/,'') + '/solve-intent', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error('Solver HTTP ' + r.status);
  return await r.json();
}

export async function verifyPlan(plan, intentRaw) {
  if (!plan) return { ok:false, reason:'empty plan' };
  const h = await canonicalHash(intentRaw);
  if (plan.intentHash && plan.intentHash.toLowerCase() !== h.toLowerCase())
    return { ok:false, reason:'intentHash mismatch' };
  return { ok:true };
}

async function mockSolve({ bundle }) {
  return {
    plan: {
      intentHash: await canonicalHash(bundle.intent),
      steps: [
        { chain: bundle.intent.chain, action:'transfer', asset: bundle.intent.asset, amount: bundle.intent.amount, to: bundle.intent.recipient }
      ],
      fees: { estimate: '0' }
    },
    routes: [{ score: 1.0, hops: 1 }],
    receipt: { mock: true }
  };
}
