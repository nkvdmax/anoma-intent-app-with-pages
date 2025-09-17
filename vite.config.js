import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@wormhole-foundation/wormhole-connect",
      "styled-components",
      "@solana/web3.js",
      "@mysten/sui.js"
    ]
  },
  build: {
    // зрідка допомагає, якщо всередині є CJS-файли
    commonjsOptions: { include: [/node_modules/] }
  }
});
