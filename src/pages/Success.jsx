import React, { useEffect, useMemo, useState } from "react";
import { explorers } from "../lib/explorers.js";
import { createPublicClient, http } from "viem";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export default function Success() {
  // читаємо з URL: #/success?chain=evm-sepolia&tx=...&to=...
  const params = useMemo(() => new URLSearchParams((window.location.hash.split("?")[1]) || ""), []);
  const chain = params.get("chain") || "";
  const tx = params.get("tx") || "";
  const to = params.get("to") || "";

  const [status, setStatus] = useState("unknown");
  const [details, setDetails] = useState("");

  // хелпер для EVM-хеша (66 символів 0x...)
  const hash66 = (s) => {
    if (!s) return s;
    const h = s.startsWith("0x") ? s : ("0x" + s);
    return h.length === 66 ? h : h.slice(0, 66);
  };

  async function check() {
    try {
      if (chain === "evm-sepolia") {
        const rpc = import.meta.env.VITE_RPC_SEPOLIA;
        const client = createPublicClient({ transport: http(rpc) });
        const rec = await client.getTransactionReceipt({ hash: hash66(tx) });
        if (rec) {
          setStatus(rec.status === "success" ? "success" : "pending");
          setDetails(`Block ${rec.blockNumber}, gasUsed ${rec.gasUsed}`);
        } else {
          setStatus("pending");
          setDetails("receipt not found yet");
        }
      } else if (chain === "sol-devnet") {
        const rpc = import.meta.env.VITE_RPC_SOLANA_DEVNET || clusterApiUrl("devnet");
        const conn = new Connection(rpc);
        const st = await conn.getSignatureStatus(tx);
        const conf = st?.value?.confirmationStatus;
        setStatus(conf || "pending");
        setDetails(JSON.stringify(st.value || {}, null, 2));
      } else if (chain === "sui-testnet") {
        // Без SDK: простий JSON-RPC запит до fullnode
        const url = import.meta.env.VITE_RPC_SUI_TESTNET || "https://fullnode.testnet.sui.io";
        const body = {
          jsonrpc: "2.0",
          id: 1,
          method: "sui_getTransactionBlock",
          params: [tx]
        };
        const res = await fetch(url, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body)
        }).then(r => r.json());
        const eff = res?.result?.effects?.status;
        const s = (eff?.status || "").toLowerCase() || "pending";
        setStatus(s);
        setDetails(JSON.stringify(eff || res, null, 2));
      } else {
        setStatus("unknown");
        setDetails("");
      }
    } catch (e) {
      setStatus("pending");
      setDetails(String(e));
    }
  }

  useEffect(() => { if (tx && chain) check(); }, [tx, chain]);

  const shareUrl = window.location.href;
  const links = {
    "evm-sepolia": explorers.evm.sepolia.tx(tx),
    "sol-devnet": explorers.sol.devnet.tx(tx),
    "sui-testnet": explorers.sui.testnet.tx(tx)
  };

  return (
    <section className="section py-14">
      <div className="card gradient-border p-6">
        <h1 className="text-3xl font-extrabold mb-2 text-gradient-red">Payment sent!</h1>
        <p className="text-white/70 mb-6">Track status below and share the result with recipient.</p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border border-white/10 p-4 bg-white/[.03]">
            <div className="text-white/70 text-sm">Network</div>
            <div className="text-white font-semibold">{chain || "-"}</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4 bg-white/[.03]">
            <div className="text-white/70 text-sm">Tx</div>
            <div className="text-white font-mono break-all">{tx || "-"}</div>
          </div>
          <div className="rounded-xl border border-white/10 p-4 bg-white/[.03] sm:col-span-2">
            <div className="text-white/70 text-sm">Recipient</div>
            <div className="text-white font-mono break-all">{to || "-"}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {links[chain] && <a className="btn" href={links[chain]} target="_blank" rel="noreferrer">Open in Explorer</a>}
          <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(shareUrl)}>Copy share link</button>
          <button className="btn-ghost" onClick={check}>Re-check status</button>
        </div>

        <div className="rounded-xl border border-white/10 p-4 bg-black/30">
          <div className="text-white/70 text-sm mb-2">Current status</div>
          <div className="text-white font-semibold mb-2">{status}</div>
          {details && <pre className="code text-xs whitespace-pre-wrap opacity-80">{details}</pre>}
        </div>
      </div>
    </section>
  );
}

