import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/20 border-b border-white/10">
      <div className="section py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center drop-shadow-glow">
            <span className="text-brand-300 font-bold">A</span>
          </div>
          <span className="font-semibold tracking-wide">Anoma Intent App</span>
        </a>
        <nav className="hidden sm:flex items-center gap-2">
          <a href="#features" className="btn-ghost">Features</a>
          <a href="#how" className="btn-ghost">How it works</a>
          <a href="#faq" className="btn-ghost">FAQ</a>
          <a href="https://github.com/nkvdmax/anoma-intent-app-with-pages" target="_blank" rel="noreferrer" className="btn">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
