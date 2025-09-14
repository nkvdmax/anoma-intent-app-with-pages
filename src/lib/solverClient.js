import { canonicalizeIntent, sha256Hex } from './canonical.js';

function endpoint(){
  const url = import.meta?.env?.VITE_SOLVER_URL || '';
  return (url||'').trim();
}

async function tryRealSolver(bundle){
  const url = endpoint();
  if(!url) return null;
  const r = await fetch(url.replace(/\/$/,'') + '/solve-intent', {
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify(bundle),
  });
  if(!r.ok) throw new Error('Solver HTTP '+r.status);
  return await r.json();
}

// дуже простий мок-план (для демо)
function mockPlan(bundle){
  const steps = [{
    chain: bundle.intent.chain,
    action: 'transfer',
    asset: bundle.intent.asset,
    amount: bundle.intent.amount,
    to: bundle.intent.recipient
  }];
  return { planId: 'mock-'+Date.now(), steps, quote:{fee:'0', estTimeSec: 5}, signature:'', verified:false };
}

export async function solveIntent(bundle){
  // нормалізація і контрольний хеш на клієнті
  const canonical = canonicalizeIntent(bundle.intent);
  const canonHash = await sha256Hex(JSON.stringify(canonical));
  const augmented = { ...bundle, canonical, canonHash };

  try {
    const real = await tryRealSolver(augmented);
    if(real) return { ...real, source:'remote', canonical, canonHash };
  } catch(e){
    console.warn('Solver failed, using mock:', e?.message||e);
  }
  return { ...mockPlan(augmented), source:'mock', canonical, canonHash };
}
