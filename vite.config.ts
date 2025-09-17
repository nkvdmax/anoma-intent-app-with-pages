import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/anoma-intent-app-with-pages/",
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@wormhole-foundation/wormhole-connect",
      "@solana/web3.js",
      
    ],
  },
});

