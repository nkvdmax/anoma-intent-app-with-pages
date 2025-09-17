import React from "react";

export default function Header() {
  // базовий шлях для GitHub Pages
  const base = import.meta.env.BASE_URL;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="section py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img 
            src={`${base}img/anoma-hood.png`} 
            alt="Anoma" 
            className="h-9 w-9 rounded-lg border border-brand-500/40 drop-shadow-redglow object-cover" 
          />
          <span className="font-semibold tracking-wide">Anoma Intent App</span>
        </a>
        <nav className="hidden sm:flex items-center gap-2">
          <a className="btn-ghost" href="#features">Features</a>
          <a className="btn-ghost" href="#how">How it works</a>
          <a className="btn-ghost" href="#faq">FAQ</a>
          <a 
            className="btn" 
            href="https://github.com/nkvdmax/anoma-intent-app-with-pages" 
            target="_blank" 
            rel="noreferrer"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}

