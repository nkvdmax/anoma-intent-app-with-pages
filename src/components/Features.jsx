import React from "react";
import { Shield, Workflow, Zap, Layers } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  { Icon: Workflow, title: "Intent-based", desc: "Describe outcome; routes & matchers are derived." },
  { Icon: Shield,   title: "Secure",       desc: "Isolated flows, safe RPC, no secrets in client." },
  { Icon: Layers,   title: "Composable",   desc: "Works with wagmi/viem and your components." },
  { Icon: Zap,      title: "Fast",         desc: "Lean UI and tuned build for instant loads." },
];

export default function Features() {
  return (
    <section id="features" className="section py-20">
      <div className="text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          <span className="text-gradient-red">Why it stands out</span>
        </h2>
        <p className="text-white/70 mt-4 max-w-2xl mx-auto">
          Red/black minimalism + soft glow. Focus on outcomes, not steps.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {items.map(({ Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
            className="card hover:bg-white/[0.08] transition"
          >
            <div className="h-11 w-11 rounded-xl bg-brand-600/20 border border-brand-600/40 flex items-center justify-center drop-shadow-redglow">
              <Icon className="h-5 w-5 text-brand-300" />
            </div>
            <div className="mt-4 font-semibold">{title}</div>
            <div className="text-white/70 text-sm mt-2">{desc}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
