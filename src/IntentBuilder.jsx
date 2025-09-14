import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { NETWORKS, assetsFor, resolveAssetAddress } from "./lib/networks";
import { sanitizeRecipient, isPositiveAmount, validRecipient, isAllowed } from "./lib/security";
import { canonicalHash } from "./lib/canonical";
import { solveIntent, verifyPlan } from "./lib/solverClient";
import { executeEvm, executeSolana, executeSui } from "./lib/execute";

const LS_KEY = "intent_history_v2";

function loadHistory(){ try{ return JSON.parse(localStorage.getItem(LS_KEY)||"[]"); }catch{return []} }
function saveHistory(list){ localStorage.setItem(LS_KEY, JSON.stringify(list)); }

export default function IntentBuilder(){
  const [chain, setChain] = useState("EVM");
  const [network, setNetwork] = useState("eth-mainnet");
  const [asset, setAsset] = useState("USDC");
  const [amount, setAmount] = useState("0.01");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [bundle, setBundle] = useState(null);
  const [plan, setPlan] = useState(null);
  const [busy, setBusy] = useState(false);

  const nets = useMemo(()=> NETWORKS.filter(n=>n.chain===chain), [chain]);
  const assetList = useMemo(()=> assetsFor(chain), [chain]);

  async function buildAndHash(){
    const rec = sanitizeRecipient(recipient);
    if(!isPositiveAmount(amount)) return toast.error("Amount must be positive");
    if(!validRecipient(chain, rec)) return toast.error("Recipient invalid for chain");
    if(!isAllowed({chain, network, asset})) toast.warning("Asset not in allowlist (demo)");

    const intent = { chain, network, asset, amount: amount.trim(), recipient: rec, note: note.trim(), createdAt: Date.now() };
    const { message, hash, canon } = await canonicalHash(intent);

    const resolved = resolveAssetAddress(network, asset);
    const built = { intent: canon, message, hash, resolvedAsset: resolved || null };
    setBundle(built);
    setPlan(null);
    toast.success("Intent built");
  }

  async function signIntent(){
    if(!bundle?.message) return toast.error("Build first");
    // Sign as before (using wallet-specific signers). For brevity, we store unsigned marker:
    const signed = { scheme:"none", signature:"", note:"demo unsigned" };
    const record = { id: crypto.randomUUID(), createdAt: Date.now(), ...bundle, signed };
    const list = loadHistory(); list.unshift(record); saveHistory(list);
    setBundle(record); toast.success("Saved to history");
  }

  async function onSolve(){
    if(!bundle?.hash) return toast.error("Build first");
    setBusy(true);
    try{
      const res = await solveIntent(bundle);
      setPlan(res.plan || null);
      const ok = await verifyPlan(res.plan, bundle);
      toast[ok?"success":"error"](ok? "Plan verified":"Plan invalid");
    }catch(e){ console.error(e); toast.error(e.message||"Solve failed") }
    finally{ setBusy(false) }
  }

  async function onExecute(){
    if(!plan) return toast.error("No plan");
    try{
      if(chain==="EVM"){ const r=await executeEvm(plan); toast.success("TX: "+r.txHash) }
      else if(chain==="Solana"){ await executeSolana(plan) }
      else if(chain==="Sui"){ await executeSui(plan) }
    }catch(e){ console.error(e); toast.error(e.message||"Execute failed") }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">??</span>
        <h2 className="text-lg font-medium">Intent</h2>
      </div>

      <div className="grid sm:grid-cols-5 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Chain</p>
          <select className="w-full rounded-lg border px-3 py-2" value={chain} onChange={e=>{setChain(e.target.value); setNetwork(NETWORKS.find(n=>n.chain===e.target.value)?.id||"")}}>
            <option>EVM</option>
            <option>Solana</option>
            <option>Sui</option>
          </select>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Network</p>
          <select className="w-full rounded-lg border px-3 py-2" value={network} onChange={e=>setNetwork(e.target.value)}>
            {nets.map(n=>(<option key={n.id} value={n.id}>{n.name}</option>))}
          </select>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Asset</p>
          <select className="w-full rounded-lg border px-3 py-2" value={asset} onChange={e=>setAsset(e.target.value)}>
            {assetList.map(a=>(<option key={a.symbol} value={a.symbol}>{a.symbol}</option>))}
          </select>
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Amount</p>
          <input className="w-full rounded-lg border px-3 py-2" value={amount} onChange={e=>setAmount(e.target.value)} />
        </div>

        <div>
          <p className="text-xs text-gray-500 mb-1">Recipient</p>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="0x… / base58 / 0x…" value={recipient} onChange={e=>setRecipient(e.target.value)} />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Note</p>
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Intent note…" value={note} onChange={e=>setNote(e.target.value)} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="rounded-lg bg-slate-100 px-4 py-2 hover:bg-slate-200" onClick={buildAndHash} disabled={busy}>Build</button>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700" onClick={signIntent} disabled={busy}>Sign</button>
        <button className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700" onClick={onSolve} disabled={busy}>Solve</button>
        <button className="rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700" onClick={onExecute} disabled={!plan}>Execute</button>
      </div>

      <pre className="rounded-lg border bg-slate-50 p-3 text-xs overflow-auto whitespace-pre-wrap">
{JSON.stringify({ bundle, plan }, null, 2)}
      </pre>
    </section>
  );
}





