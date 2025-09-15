import React from "react";
export default function Footer() {
  return (
    <footer id="faq" className="section py-12 mt-20 border-t border-white/10 text-center text-white/60">
      <p>© {new Date().getFullYear()} Anoma Intent App</p>
      <div className="mt-3 flex justify-center gap-6 text-sm">
        <a className="hover:text-brand-300" href="https://github.com/nkvdmax/anoma-intent-app-with-pages" target="_blank" rel="noreferrer">GitHub</a>
        <a className="hover:text-brand-300" href="https://anoma.network/" target="_blank" rel="noreferrer">Anoma</a>
      </div>
    </footer>
  );
}
