import React, { useMemo, useState } from "react";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import "styled-components";
import { validateAddress } from "../lib/explorers";

export default function CrossChain() {
  const config = useMemo(() => ({
    env: "testnet",
    networks: {
      ethereum: { rpc: import.meta.env.VITE_RPC_SEPOLIA },
      solana:   { rpc: import.meta.env.VITE_RPC_SOLANA_DEVNET },
      sui:      { rpc: import.meta.env.VITE_RPC_SUI_TESTNET }
    },
    ui: { primary: "#ef4444", mode: "dark" },
    tokens: { allowTokens: ["ETH","USDC","WETH","SOL","SUI","USDT"] }
  }), []);

  const [recipient, setRecipient] = useState("");
  const [hint, setHint] = useState("");

  function goSuccess(chainKey, txHash) {
    const to = encodeURIComponent(recipient || "");
    const tx = encodeURIComponent(txHash || "");
    window.location.hash = `#/success?chain=${chainKey}&tx=${tx}&to=${to}`;
  }

  return (
    <section className="section py-12">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Cross-chain payment (testnet)</h1>

      <div className="card gradient-border p-5 mb-4">
        <label className="text-sm text-white/70">Pay to address (recipient on destination chain)</label>
        <div className="mt-2 flex gap-3">
          <input
            value={recipient}
            onChange={(e)=>{ setRecipient(e.target.value.trim()); setHint(""); }}
            className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white font-mono"
            placeholder="0x... (EVM)  /  Base58 (Solana)  /  0x... (Sui)"
          />
          <button
            className="btn-outline"
            onClick={()=>{
              const ok = validateAddress(recipient);
              setHint(ok ? "✓ Looks valid" : "Address looks invalid");
            }}
          >
            Validate
          </button>
        </div>
        {hint && <div className="mt-2 text-xs opacity-70">{hint}</div>}
        <div className="mt-3 text-xs text-white/60">
          Paste this same address into the "Recipient" field inside the widget below.
        </div>
      </div>

      <div className="card p-4">
        <WormholeConnect
          config={config}
          onTxSubmitted={(ctx) => {
            try {
              const chainKey =
                ctx?.sourceChain === "EVM" ? "evm-sepolia" :
                ctx?.sourceChain === "SOLANA" ? "sol-devnet" :
                ctx?.sourceChain === "SUI" ? "sui-testnet" : "";
              const txHash = ctx?.tx?.id || ctx?.txHash || ctx?.signature || "";
              goSuccess(chainKey, txHash);
            } catch (e) {
              console.warn("onTxSubmitted parse error", e);
            }
          }}
        />
      </div>

      <div className="mt-4 text-sm text-white/70">
        Didn’t redirect? 
        <button className="btn-ghost ml-2" onClick={()=>goSuccess("", "")}>Open success screen</button>
      </div>
    </section>
  );
}

