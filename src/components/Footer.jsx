import React from "react";

export default function Footer() {
  return (
    <footer className="section py-12 mt-20 border-t border-white/10 text-center text-white/60">
      <p>
        © {new Date().getFullYear()} Anoma Intent App — built with{" "}
        <span className="text-brand-400">love</span> & Vercel
      </p>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <a href="https://github.com/nkvdmax/anoma-intent-app-with-pages" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a>
        <a href="https://anoma.network/" target="_blank" rel="noreferrer" className="hover:text-white">Anoma</a>
      </div>
    </footer>
  );
}
