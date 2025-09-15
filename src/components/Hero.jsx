import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onConnect }) {
  return (
    <section className="section min-h-[80vh] flex items-center justify-center text-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-brand-400/10 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10"
      >
        <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Intent-based Swaps
          </span>
        </h1>
        <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
          Trade securely with intents — fast, auditable, composable.
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button
            className="btn shadow-lg shadow-brand-500/30 hover:shadow-brand-400/40"
            onClick={onConnect}
          >
            Connect Wallet
          </button>
          <a
            href="#features"
            className="btn-ghost hover:bg-white/20 hover:text-white"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </section>
  );
}
