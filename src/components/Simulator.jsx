import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Simulator() {
  const [amountIn, setAmountIn] = useState("1.00");
  const [status, setStatus] = useState<"idle"|"creating"|"done">("idle");

  const createIntent = async () => {
    setStatus("creating");
    await new Promise(r => setTimeout(r, 900)); // імітація
    setStatus("done");
    setTimeout(()=>setStatus("idle"), 1500);
  };

  return (
    <section id="simulator" className="section py-16">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 text-gradient-red">Swap simulator</h2>
          <p className="text-white/70 max-w-xl">
            Demo-only UI: create a simple “intent” and see how it would be executed. No chain calls here.
          </p>
          <div className="mt-6 flex gap-3">
            <button className="btn" onClick={createIntent} disabled={status!=="idle"}>
              {status==="creating" ? "Creating..." : status==="done" ? "Created!" : "Create intent"}
            </button>
            <a href="#faq" className="btn-outline">Learn more</a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: .6 }}
          className="card gradient-border p-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-white/70">You send</label>
              <span className="text-xs text-white/50">Testnet</span>
            </div>
            <div className="flex gap-3">
              <input
                value={amountIn}
                onChange={e=>setAmountIn(e.target.value)}
                className="flex-1 rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white"
                placeholder="0.00"
              />
              <div className="rounded-xl px-3 py-3 bg-white/5 border border-white/10">ANOMA</div>
            </div>

            <div className="opacity-70 text-sm">Estimated result</div>
            <motion.div
              key={status}
              initial={{ opacity:.5, scale:.98 }}
              animate={{ opacity:1, scale:1 }}
              className="rounded-xl px-4 py-4 bg-white/[.04] border border-white/10"
            >
              {status==="done"
                ? <span className="text-emerald-400 font-semibold">Intent created · swap routed</span>
                : status==="creating"
                ? <span className="text-amber-300">Simulating route...</span>
                : <span className="text-white/80">You will receive ≈ {(Number(amountIn)||0*0.98).toString()} ASSET</span>}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
