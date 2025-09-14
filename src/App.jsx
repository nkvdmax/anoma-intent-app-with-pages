import React, { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

export default function App() {
  const [value, setValue] = useState('')

  const { address, isConnected } = useAccount()
  const { connect, isPending: isConnecting } = useConnect({
    connector: injected(),
    onSuccess: () => toast.success('Wallet connected'),
    onError: (e) => toast.error(e?.message ?? 'Connection failed'),
  })
  const { disconnect } = useDisconnect({
    onSuccess: () => toast('Disconnected'),
  })

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="top-right" richColors />
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
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

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Wallet block */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">🔌</span>
            <h2 className="text-lg font-medium">Wallet</h2>
          </div>

          {!isConnected ? (
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60"
              onClick={() => connect()}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting…' : 'Connect Wallet'}
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-sm text-gray-700 truncate">
                Connected: <span className="font-mono">{address}</span>
              </span>
              <button
                className="rounded-lg border px-3 py-2 hover:bg-gray-50"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            </div>
          )}
        </section>

        {/* Tailwind check + simple intent form */}
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-indigo-600">⚡</span>
            <h2 className="text-lg font-medium">Tailwind</h2>
          </div>
          <p className="text-gray-600">
            Якщо бачиш кольорові кнопки й акуратні картки — Tailwind підключений правильно.
          </p>

          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Intent note (довільний текст)…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800"
              onClick={() => {
                toast.success(\Intent submitted: \\)
                setValue('')
              }}
            >
              Submit Intent
            </button>
          </div>
        </section>

        {/* Info cards */}
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
  )
}
