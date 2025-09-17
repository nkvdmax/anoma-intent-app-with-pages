import React from "react";
import { motion } from "framer-motion";

export default function Hero({ onConnect }) {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="section pt-14 pb-16 relative">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight">
            <span className="text-gradient-red">Intent-based swaps</span>
          </h1>
          <p className="mt-6 text-white/70 max-w-xl">
            Clean, fast and secure. Red/black minimalism with subtle glow. Connect a wallet and create an intent.
          </p>
          <div className="mt-8 flex gap-3">
            <button className="btn" onClick={onConnect}>Connect Wallet</button>
            <a className="btn-ghost" href="#features">Learn more</a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: .95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .8, delay: .15 }}
          className="card relative overflow-hidden flex items-center justify-center"
        >
          <img 
            src={`${base}img/red-gem.png`} 
            alt="Red gem" 
            className="w-64 h-64 object-contain drop-shadow-redglow" 
          />
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              backgroundImage: "radial-gradient(1px 1px at 1px 1px, rgba(255,255,255,.09) 1px, transparent 0)",
              backgroundSize: "22px 22px"
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}





