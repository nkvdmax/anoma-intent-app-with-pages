import React, { useMemo, useState } from "react";
import { makeIntent, hashIntent } from "./lib/intent.js";
import { toHex, toBase64 } from "./lib/utils.js";
import { toast } from "sonner";

export default function IntentBuilder() {
  const [chain, setChain] = useState("evm");
  const [asset, setAsset] = useState("ETH");
  const [amount, setAmount] = useState("0.01");
  const [to, setTo] = useState("");
  const [hashHex, setHashHex] = useState("");
  const [bundle, setBundle] = useState("");

  const providerEvm = typeof window !== "undefined" ? window.ethereum : null;
  const providerSol = typeof window !== "undefined" ? (window.solana || window.phantom?.solana) : null;
  const providerSui = typeof window !== "undefined" ? (window.sui || window.suiWallet) : null;

  async function buildAndHash() {
    try {
      const intent = makeIntent({ chain, asset, amount, to });
      const h = await hashIntent(intent);
      setHashHex(toHex(h));
      setBundle(JSON.stringify(intent, null, 2));
      toast.success("Intent built");
      return { intent, h };
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Failed to build intent");
    }
  }

  async function signIntent() {
    const built = await buildAndHash();
    if (!built) return;
    const { intent, h } = built;
    const msg = "anoma-intent:" + toHex(h);

    try {
      let sig, scheme;
      if (chain === "evm") {
        if (!providerEvm) throw new Error("No EVM provider");
        const accounts = await providerEvm.request({ method: "eth_requestAccounts" });
        const from = accounts?.[0];
        if (!from) throw new Error("No EVM account");
        sig = await providerEvm.request({ method: "personal_sign", params: [msg, from] });
        scheme = { type: "evm", encoding: "hex" }; // personal_sign returns 0xЕ hex
      } else if (chain === "solana") {
        if (!providerSol) throw new Error("No Solana provider");
        const res = await providerSol.connect();
        const pk = (res?.publicKey ?? providerSol.publicKey)?.toString();
        if (!pk) throw new Error("No Solana account");
        if (!providerSol.signMessage) throw new Error("Wallet does not support signMessage");
        const bytes = new TextEncoder().encode(msg);
        const out = await providerSol.signMessage(bytes, "utf8");
        sig = toBase64(out.signature);
        scheme = { type: "solana", encoding: "base64" };
      } else if (chain === "sui") {
        if (!providerSui?.request) throw new Error("No Sui provider");
        try {
          await providerSui.request({
            method: "sui_requestPermissions",
            params: [{ permissions: ["viewAccount", "suggestTransactions"] }],
          });
        } catch {}
        const accounts = await providerSui.request({ method: "sui_accounts" });
        const addr = Array.isArray(accounts) ? accounts[0] : accounts?.data?.[0];
        if (!addr) throw new Error("No Sui account");
        const bytes = new TextEncoder().encode(msg);
        const out = await providerSui.request({ method: "sui_signMessage", params: { message: bytes } });
        // де€к≥ гаманц≥ повертають { signature, messageBytes }
        sig = out?.signature || out?.data?.signature || (out?.signedMessage && toBase64(out.signedMessage));
        if (!sig) sig = typeof out === "string" ? out : JSON.stringify(out);
        scheme = { type: "sui", encoding: (typeof sig === "string" && sig.startsWith("AQ==")) ? "base64" : "auto" };
      } else {
        throw new Error("Unsupported chain");
      }

      const bundleObj = { intent, hash: toHex(h), sig, scheme };
      setBundle(JSON.stringify(bundleObj, null, 2));
      toast.success("Intent signed");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Sign failed");
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
          <input className="w-full rounded-lg border px-3 py-2" placeholder="0xЕ / address" value={to} onChange={e => setTo(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3">
        <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200" onClick={buildAndHash}>
          Build & Hash
        </button>
        <button className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700" onClick={signIntent}>
          Sign intent
        </button>
        {hashHex && <span className="text-sm text-gray-500">hash: <code className="font-mono">{hashHex.slice(0, 16)}Е</code></span>}
      </div>

      <textarea className="w-full h-48 font-mono text-sm rounded-lg border p-3" value={bundle} onChange={()=>{}} placeholder="Bundle (intent / signed intent) will appear hereЕ" />
    </section>
  );
}
