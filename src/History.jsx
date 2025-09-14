import React, { useEffect, useState } from "react";
import { loadHistory, removeHistory } from "./lib/storage.js";
import { verifyBundle } from "./lib/verify.js";
import { toast } from "sonner";

function download(name, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
}

export default function History() {
  const [items, setItems] = useState([]);

  function refresh() { setItems(loadHistory()); }
  useEffect(() => { refresh(); }, []);

  async function verifyOne(b) {
    const res = await verifyBundle(b.bundle);
    toast[res.ok? "success":"error"](res.ok ? "Valid ?" : ("Invalid ? " + (res.reason||"")));
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">???</span>
        <h2 className="text-lg font-medium">History</h2>
      </div>

      {items.length === 0 && <p className="text-sm text-gray-500">No saved bundles yet.</p>}

      <div className="space-y-3">
        {items.map(it => (
          <div key={it.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-gray-600">
                <span className="font-mono">{it.bundle?.intent?.type}</span> • {it.bundle?.intent?.chain} • {new Date(it.ts).toLocaleString()}
              </div>
              <div className="flex gap-2">
                <button className="rounded-lg bg-slate-100 px-2 py-1 text-sm hover:bg-slate-200" onClick={()=>navigator.clipboard.writeText(JSON.stringify(it.bundle,null,2))}>Copy</button>
                <button className="rounded-lg bg-slate-100 px-2 py-1 text-sm hover:bg-slate-200" onClick={()=>download(`bundle-${it.id}.json`, JSON.stringify(it.bundle,null,2))}>Download</button>
                <button className="rounded-lg bg-slate-100 px-2 py-1 text-sm hover:bg-slate-200" onClick={()=>verifyOne(it)}>Verify</button>
                <button className="rounded-lg bg-slate-100 px-2 py-1 text-sm hover:bg-slate-200" onClick={()=>{ setItems(removeHistory(it.id)); }}>Delete</button>
              </div>
            </div>
            <pre className="mt-2 text-xs overflow-auto max-h-40">{JSON.stringify(it.bundle,null,2)}</pre>
          </div>
        ))}
      </div>
    </section>
  );
}
