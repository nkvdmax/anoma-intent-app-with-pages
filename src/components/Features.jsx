import React from "react";

const items = [
  { t: "Intent-based", d: "Describe the outcome; the app figures out routes and matchers." },
  { t: "Secure", d: "Isolated flows, no secrets in the client, safe RPC usage." },
  { t: "Composable", d: "Works with wagmi/viem and your existing components." },
  { t: "Auditable", d: "Deterministic build and clear on-chain actions." },
];

export default function Features() {
  return (
    <section id="features" className="section py-16">
      <h2 className="text-3xl font-semibold">Why this approach</h2>
      <p className="text-white/70 mt-2 max-w-2xl">A compact feature set mirroring the reference site’s structure.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {items.map((x) => (
          <div key={x.t} className="card">
            <div className="text-brand-300 font-medium">{x.t}</div>
            <div className="text-white/70 mt-2 text-sm">{x.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
