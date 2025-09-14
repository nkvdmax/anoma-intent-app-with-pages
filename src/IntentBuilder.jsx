import React, { useState } from "react";
import { makeIntent, hashIntent } from "./lib/intent.js";
import { toHex, toBase64 } from "./lib/utils.js";
import { toast } from "sonner";
import { pushHistory } from "./lib/storage.js";
import { verifyBundle } from "./lib/verify.js";
import { mockSolve, mockRelay } from "./lib/solver.js";

export default function IntentBuilder() {
  const [chain, setChain] = useState("evm");
  const [asset, setAsset] = useState("ETH");
  const [amount, setAmount] = useState("0.01");
  const [to, setTo] = useState("");
  const [hashHex, setHashHex] = useState("");
  const [bundleText, setBundleText] = useState("");
  const [result, setResult] = useState("");

  const providerEvm = typeof window !== "undefined" ? window.ethereum : null;
  const providerSol = typeof window !== "undefined" ? (window.solana || window.phantom?.solana) : null;
  const providerSui = typeof window !== "undefined" ? (window.sui || window.suiWallet) : null;

  async function buildAndHash() {
    const intent = makeIntent({ chain, asset, amount, to });
    const h = await hashIntent(intent);
    const hash = toHex(h);
    setHashHex(hash);
    setBundleText(JSON.stringify(intent, null, 2));
    toast.success("Intent built");
    setResult("");
    return { intent, hash, h };
  }

  async function signIntent() {
    const built = await buildAndHash();
    if (!built) return;
    const { intent, hash } = built;
    const msg = "anoma-intent:" + hash;

    try {
      let sig, scheme, meta = {};
      if (chain === "evm") {
        if (!providerEvm) throw new Error("No EVM provider");
        const accounts = await providerEvm.request({ method: "eth_requestAccounts" });
        const from = accounts?.[0];
        if (!from) throw new Error("No EVM account");
        sig = await providerEvm.request({ method: "personal_sign", params: [msg, from] });
        scheme = { type: "evm", encoding: "hex" };
        meta.from = from;
      } else if (chain === "solana") {
        if (!providerSol) throw new Error("No Solana provider");
        const res = await providerSol.connect();
        const pkObj = (res?.publicKey ?? providerSol.publicKey);
        const pkBytes = pkObj?.toBytes?.();
        if (!pkBytes) throw new Error("No Solana publicKey");
        const bytes = new TextEncoder().encode(msg);
        if (!providerSol.signMessage) throw new Error("Wallet does not support signMessage");
        const out = await providerSol.signMessage(bytes, "utf8");
        sig = toBase64(out.signature);
        scheme = { type: "solana", encoding: "base64" };
        meta.pubkeyB64 = toBase64(pkBytes);
      } else if (chain === "sui") {
        if (!providerSui?.request) throw new Error("No Sui provider");
        try {
          await providerSui.request({
            method: "sui_requestPermissions",
            params: [{ permissions: ["viewAccount", "suggestTransactions"] }],
          });
        } catch {}
        const bytes = new TextEncoder().encode(msg);
        const out = await providerSui.request({ method: "sui_signMessage", params: { message: bytes } });
        sig = out?.signature || out?.data?.signature || (out?.signedMessage && toBase64(out.signedMessage)) || (typeof out==="string"? out : JSON.stringify(out));
        scheme = { type: "sui", encoding: "auto" };
      } else {
        throw new Error("Unsupported chain");
      }

      const bundle = { intent, hash, sig, scheme, meta };
      setBundleText(JSON.stringify(bundle, null, 2));
      setResult("Signed ?");
      toast.success("Intent signed");
      return bundle;
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Sign failed");
    }
  }

  function saveBundle() {
    try {
      const obj = JSON.parse(bundleText || "{}");
      if (!obj.intent || !obj.hash) throw new Error("Nothing to save: sign or build first");
      pushHistory({ bundle: obj });
      toast.success("Saved to history");
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function verifyNow() {
    try {
      const obj = JSON.parse(bundleText || "{}");
      const res = await verifyBundle(obj);
      setResult("Verify: " + (res.ok ? "OK ?" : "FAIL ?" + (res.reason ? " – " + res.reason : "")));
      toast[res.ok ? "success" : "error"](res.ok ? "Signature valid" : (res.reason || "Invalid signature"));
    } catch (e) {
      toast.error(e.message || "Cannot parse bundle");
    }
  }

  async function sendToSolver() {
    try {
      const obj = JSON.parse(bundleText || "{}");
      if (!obj.sig) throw new Error("Sign intent first");
      const sol = await mockSolve(obj);
      setResult("Solver: " + (sol.ok ? `OK (solutionId: ${sol.solutionId})` : "FAIL"));
      setBundleText(JSON.stringify({ ...obj, solver: sol }, null, 2));
    } catch (e) {
      toast.error(e.message);
    }
  }

  async function relayNow() {
    try {
      const obj = JSON.parse(bundleText || "{}");
      if (!obj?.solver?.ok) throw new Error("Send to solver first");
      const rel = await mockRelay(obj.solver);
      setResult("Relayer: " + (rel.ok ? `OK (txPayload: ${rel.txPayload})` : "FAIL"));
      setBundleText(JSON.stringify({ ...obj, relay: rel }, null, 2));
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">??</span>
        <h2 className="text-lg font-medium">Intent</h2>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <p className="text-sm text-gray-500 mb-1">Chain</p>
          <select className="w-full rounded-lg border px-3 py-2" value={chain} onChange={e => setChain(e.target.value)}>
            <option value="evm">EVM</option>
            <option value="solana">Solana</option>
            <option value="sui">Sui</option>
          </select>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Asset</p>
          <input className="w-full rounded-lg border px-3 py-2" value={asset} onChange={e => setAsset(e.target.value)} />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Amount</p>
          <input className="w-full rounded-lg border px-3 py-2" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Recipient</p>
          <input className="w-full rounded-lg border px-3 py-2" placeholder="0x… / address" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200" onClick={buildAndHash}>Build & Hash</button>
        <button className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700" onClick={signIntent}>Sign intent</button>
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200" onClick={saveBundle}>Save</button>
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200" onClick={verifyNow}>Verify</button>
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200" onClick={sendToSolver}>Send to solver</button>
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200" onClick={relayNow}>Relay (dry-run)</button>
        {hashHex && <span className="text-sm text-gray-500">hash: <code className="font-mono">{hashHex.slice(0,16)}…</code></span>}
      </div>

      <textarea className="w-full h-56 font-mono text-sm rounded-lg border p-3" value={bundleText} onChange={e=>setBundleText(e.target.value)} placeholder="Bundle (intent / signed/solved/relayed) will appear here…" />
      {result && <div className="text-sm text-gray-600">{result}</div>}
    </section>
  );
}
