export function verifyPlan(bundle, plan){
  if(!plan || !Array.isArray(plan.steps) || !plan.steps.length) return { ok:false, reason:'empty plan' };
  // примітив: перший крок має відповідати базовим полям інтенту
  const s = plan.steps[0];
  const i = bundle.intent||{};
  const ok = s.action==='transfer' && s.asset===i.asset && String(s.to||'').length>0;
  return { ok, reason: ok?'':'not transfer / mismatch' };
}
