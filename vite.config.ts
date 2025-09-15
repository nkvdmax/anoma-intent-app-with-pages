import { defineConfig } from "vite";

export default defineConfig({
  base: "/",           // Vercel -> "/", GitHub Pages -> "/anoma-intent-app-with-pages/"
  build: { outDir: "dist", sourcemap: false }
});
