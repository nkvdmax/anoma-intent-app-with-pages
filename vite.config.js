import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@solana/web3.js",
      "@mysten/sui",
      "@wormhole-foundation/wormhole-connect"
    ]
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
});
