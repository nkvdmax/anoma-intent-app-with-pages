import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { verifyBundle } from './lib/verify.js';
import { ethers } from 'ethers';

const LS_KEY = 'intent_history_v1';

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function save(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => setItems(loadHistory()), []);

  function remove(id) {
    const next = items.filter(x => x.id !== id);
    setItems(next); save(next);
  }
  function clearAll() {
    setItems([]); save([]); toast.success('History cleared');
  }
  async function copy(item) {
    const s = JSON.stringify(item, null, 2);
    await navigator.clipboard.writeText(s);
    toast.success('Copied to clipboard');
  }

  async function verify(item) {
    try {
      // Prefer bundle verifier (ed25519), else EVM recovery
      if (item?.signed?.scheme?.includes('ed25519') && item.signed.publicKey && item.signed.signature) {
        const msgBytes = new TextEncoder().encode(item.message);
        const ok = await verifyBundle(item.signed.signature, msgBytes, item.signed.publicKey);
        toast[ok ? 'success' : 'error'](ok ? 'Valid ed25519 signature' : 'Invalid ed25519 signature');
        return;
      }
      if (item?.signed?.scheme === 'evm_personal_sign' && item.signed.address && item.signed.signature) {
        const recovered = ethers.utils.verifyMessage(item.message, item.signed.signature);
        const ok = recovered?.toLowerCase?.() === item.signed.address?.toLowerCase?.();
        toast[ok ? 'success' : 'error'](ok ? 'Valid EVM signature' : 'Invalid EVM signature');
        return;
      }
      toast.info('Nothing to verify (unsigned or unknown scheme)');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Verify failed');
    }
  }

  if (!items.length) {
    return (
      <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">??</span>
          <h2 className="text-lg font-medium">History</h2>
        </div>
        <p className="text-gray-500 text-sm">No items yet — sign an intent first.</p>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">??</span>
          <h2 className="text-lg font-medium">History</h2>
        </div>
        <button onClick={clearAll}
          className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200 active:bg-slate-300">
          Clear all
        </button>
      </div>

      <div className="grid gap-3">
        {items.map(item => (
          <div key={item.id} className="rounded-lg border p-3">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-2 py-0.5 rounded bg-slate-100">{item.chain}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">{item.asset}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100">{item.amount}</span>
              <span className="px-2 py-0.5 rounded bg-slate-100 truncate max-w-[28ch]" title={item.recipient || 'N/A'}>
                {item.recipient || 'N/A'}
              </span>
              <span className="text-slate-500 ml-auto">{new Date(item.createdAt).toLocaleString()}</span>
            </div>

            <pre className="mt-2 rounded bg-slate-50 border p-2 text-xs overflow-auto whitespace-pre-wrap">
{JSON.stringify({ message: item.message, hash: item.hash, signed: item.signed }, null, 2)}
            </pre>

            <div className="mt-2 flex gap-2">
              <button onClick={() => verify(item)}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-white text-sm hover:bg-emerald-700">Verify</button>
              <button onClick={() => copy(item)}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200">Copy</button>
              <button onClick={() => remove(item.id)}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-white text-sm hover:bg-rose-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
