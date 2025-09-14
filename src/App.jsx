import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [note, setNote] = useState('');

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
        {/* Wallet section */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">🔗</span>
            <h2 className="text-lg font-medium">Wallet</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              'Injected', 'Rabby Wallet', 'Phantom', 'Keplr',
              'Coinbase Wallet', 'MetaMask', 'Rainbow',
              'Pontem Wallet', 'Compass Wallet', 'Magic Eden', 'Leap Wallet'
            ].map((w) => (
              <button
                key={w}
                type="button"
                className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 active:bg-indigo-200"
                onClick={() => toast.info(${w} connect: not wired yet)}
              >
                Connect {w}
              </button>
            ))}
          </div>
        </section>

        {/* Tailwind check + intent form */}
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

        {/* Status cards */}
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
