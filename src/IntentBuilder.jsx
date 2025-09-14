import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

const LS_KEY = 'intent_history_v1';

function toHex(uint8) {
  return Array.from(uint8).map(b => b.toString(16).padStart(2, '0')).join('');
}
function fromUtf8(str) {
  return new TextEncoder().encode(str);
}
async function sha256Hex(data) {
  const bytes = typeof data === 'string' ? fromUtf8(data) : data;
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return toHex(new Uint8Array(digest));
}

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function saveHistory(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

export default function IntentBuilder() {
  const [chain, setChain] = useState('EVM');
  const [asset, setAsset] = useState('ETH');
  const [amount, setAmount] = useState('0.01');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [bundle, setBundle] = useState(null);
  const [busy, setBusy] = useState(false);

  const preview = useMemo(
    () => JSON.stringify(bundle ?? { info: 'Bundle (intent / signature) will appear here' }, null, 2),
    [bundle]
  );

  async function buildAndHash() {
    const intent = {
      chain, asset,
      amount: amount.trim(),
      recipient: recipient.trim(),
      note: note.trim(),
      ts: Date.now()
    };
    const message = JSON.stringify(intent);
    const hash = await sha256Hex(message);
    const built = { intent, message, hash };
    setBundle(built);
    toast.success('Intent built & hashed');
  }

  async function signIntent() {
    if (!bundle?.message) {
      toast.error('Build intent first');
      return;
    }
    setBusy(true);
    try {
      const message = bundle.message;
      let signed = null;

      if (chain === 'EVM' && window.ethereum) {
        // personal_sign expects hex message or utf8; hex is more universal
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const address = accounts?.[0];
        if (!address) throw new Error('No EVM account');
        const hexMsg = '0x' + toHex(fromUtf8(message));
        const sig = await window.ethereum.request({
          method: 'personal_sign',
          params: [hexMsg, address],
        });
        signed = { scheme: 'evm_personal_sign', address, signature: sig };
      } else if (chain === 'Solana' && window.solana?.signMessage) {
        const encoded = fromUtf8(message);
        const { signature, publicKey } = await window.solana.signMessage(encoded, 'utf8');
        signed = {
          scheme: 'solana_ed25519',
          publicKey: publicKey?.toString?.() ?? '',
          signature: toHex(signature),
        };
      } else if (chain === 'Sui' && window.sui?.signMessage) {
        // Most Sui wallets expose signMessage. If not, fallback below.
        const encoded = fromUtf8(message);
        const res = await window.sui.signMessage({ message: encoded });
        // Typical output: { signature, messageBytes, signatureScheme, publicKey }
        signed = {
          scheme: res?.signatureScheme?.toLowerCase?.() || 'sui_ed25519',
          publicKey: res?.publicKey || '',
          signature: res?.signature || '',
        };
      } else {
        // Fallback (no wallet API): store unsigned marker
        signed = { scheme: 'none', signature: '', note: 'No wallet API available to sign' };
        toast.info('No wallet API: stored unsigned bundle');
      }

      const record = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        chain, asset, amount, recipient, note,
        message: bundle.message,
        hash: bundle.hash,
        signed,
      };

      const list = loadHistory();
      list.unshift(record);
      saveHistory(list);
      setBundle(record);
      toast.success('Intent signed & saved to history');
    } catch (err) {
      console.error(err);
      toast.error(err?.message || 'Failed to sign');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">??</span>
        <h2 className="text-lg font-medium">Intent</h2>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        <div>
          <p className="text-xs text-gray-500 mb-1">Chain</p>
          <select className="w-full rounded-lg border px-3 py-2"
            value={chain} onChange={(e) => setChain(e.target.value)}>
            <option>EVM</option>
            <option>Solana</option>
            <option>Sui</option>
          </select>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Asset</p>
          <input className="w-full rounded-lg border px-3 py-2"
            value={asset} onChange={(e) => setAsset(e.target.value)} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Amount</p>
          <input className="w-full rounded-lg border px-3 py-2"
            value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Recipient</p>
          <input className="w-full rounded-lg border px-3 py-2"
            placeholder={chain === 'EVM' ? '0x… address' : 'recipient'}
            value={recipient} onChange={(e) => setRecipient(e.target.value)} />
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Note</p>
        <input className="w-full rounded-lg border px-3 py-2"
          placeholder="Intent note (any text)..." value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-lg bg-slate-100 px-4 py-2 hover:bg-slate-200 active:bg-slate-300"
          onClick={buildAndHash} disabled={busy}>
          Build & Hash
        </button>
        <button
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50"
          onClick={signIntent} disabled={busy}>
          Sign intent
        </button>
      </div>

      <pre className="rounded-lg border bg-slate-50 p-3 text-xs overflow-auto whitespace-pre-wrap">
{preview}
      </pre>
    </section>
  );
}
