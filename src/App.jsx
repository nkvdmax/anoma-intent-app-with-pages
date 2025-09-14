import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [note, setNote] = useState('');

  // addresses
  const [evmAddr, setEvmAddr] = useState('');
  const [solAddr, setSolAddr] = useState('');
  const [suiAddr, setSuiAddr] = useState('');

  // --- EVM (MetaMask / Rabby / etc.)
  const connectEvm = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        toast.error('No EVM wallet found. Install MetaMask/Rabby.');
        return;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const addr = accounts?.[0];
      if (addr) {
        setEvmAddr(addr);
        toast.success(`EVM connected: ${addr.slice(0, 6)}…${addr.slice(-4)}`);
      } else {
        toast.info('EVM: no accounts returned');
      }
    } catch (err) {
      console.error(err);
      toast.error(`EVM connect error: ${err.message ?? err}`);
    }
  };

  // --- Solana (Phantom)
  const connectSol = async () => {
    try {
      const provider = window?.solana;
      if (!provider || !provider.isPhantom) {
        toast.error('No Phantom wallet found. Install Phantom.');
        return;
      }
      const res = await provider.connect(); // may prompt
      const addr = res?.publicKey?.toString?.();
      if (addr) {
        setSolAddr(addr);
        toast.success(`Solana connected: ${addr.slice(0, 6)}…${addr.slice(-4)}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(`Solana connect error: ${err.message ?? err}`);
    }
  };

  // --- Sui (Sui Wallet / Ethos / Surf; wallet-standard)
  const connectSui = async () => {
    try {
      const sui = window?.suiWallet ?? window?.sui; // some wallets inject suiWallet, some sui
      if (!sui) {
        toast.error('No Sui wallet found. Install Sui Wallet / Ethos / Surf.');
        return;
      }
      // Request permissions (wallet-standard compatible wallets)
      if (sui.requestPermissions) {
        await sui.requestPermissions();
      }
      let accounts = [];
      if (sui.getAccounts) {
        accounts = await sui.getAccounts();
      } else if (sui.request) {
        // Fallback (older interfaces)
        const res = await sui.request({ method: 'sui_accounts' });
        accounts = res ?? [];
      }
      const addr = accounts?.[0]?.address ?? accounts?.[0];
      if (addr) {
        setSuiAddr(addr);
        toast.success(`Sui connected: ${String(addr).slice(0, 6)}…${String(addr).slice(-4)}`);
      } else {
        toast.info('Sui: no accounts returned');
      }
    } catch (err) {
      console.error(err);
      toast.error(`Sui connect error: ${err.message ?? err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="top-right" richColors />
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold">
            <span className="text-indigo-600">Anoma</span> Intent Prototype
          </h1>
          <a
            className="text-sm text-indigo-600 hover:text-indigo-700"
            href="https://nkvdmax.github.io/anoma-intent-app-with-pages/"
          >
            /anoma-intent-app-with-pages
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Wallets */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">🔗</span>
            <h2 className="text-lg font-medium">Wallet</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm hover:bg-indigo-700 active:bg-indigo-800"
              onClick={connectEvm}
              title="MetaMask / Rabby / other EVM"
            >
              Connect EVM
            </button>

            <button
              type="button"
              className="rounded-lg bg-purple-600 text-white px-3 py-2 text-sm hover:bg-purple-700 active:bg-purple-800"
              onClick={connectSol}
              title="Phantom (Solana)"
            >
              Connect Solana
            </button>

            <button
              type="button"
              className="rounded-lg bg-emerald-600 text-white px-3 py-2 text-sm hover:bg-emerald-700 active:bg-emerald-800"
              onClick={connectSui}
              title="Sui Wallet / Ethos / Surf"
            >
              Connect Sui
            </button>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 pt-2 text-sm">
            <div className="rounded-lg border bg-white px-3 py-2">
              <p className="text-gray-500">EVM</p>
              <p className="font-mono break-all">{evmAddr || '—'}</p>
            </div>
            <div className="rounded-lg border bg-white px-3 py-2">
              <p className="text-gray-500">Solana</p>
              <p className="font-mono break-all">{solAddr || '—'}</p>
            </div>
            <div className="rounded-lg border bg-white px-3 py-2">
              <p className="text-gray-500">Sui</p>
              <p className="font-mono break-all">{suiAddr || '—'}</p>
            </div>
          </div>
        </section>

        {/* Tailwind + form */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-yellow-100">⚡</span>
            <h2 className="text-lg font-medium">Tailwind</h2>
          </div>

          <p className="text-gray-600">
            If you can see a colored button and normal text — Tailwind is working correctly.
          </p>

          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Intent note (any text)…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800"
              onClick={() => {
                toast.success('Intent submitted!');
                setNote('');
              }}
            >
              Submit Intent
            </button>
          </div>
        </section>

        {/* Status */}
        <section className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Build</p>
            <p className="mt-1 font-medium">Vite + Pages</p>
          </div>
            <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">UI</p>
            <p className="mt-1 font-medium">Tailwind</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Notifications</p>
            <p className="mt-1 font-medium">Sonner</p>
          </div>
        </section>
      </main>
    </div>
  );
}
