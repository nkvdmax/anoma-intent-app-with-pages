import React, { useState } from 'react';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [value, setValue] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="top-right" richColors />
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
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

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <h2 className="text-lg font-medium">Перевірка Tailwind</h2>
          <p className="text-gray-600">
            Якщо цей блок має білий фон, округлення та тінь — Tailwind працює.
          </p>

          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Введи будь-що…"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <button
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800"
              onClick={() => toast.success(`Intent submitted: ${value || '—'}`)}
            >
              Надіслати інтент
            </button>
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Статус</p>
            <p className="mt-1 font-medium text-emerald-600">Ок</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">Білд</p>
            <p className="mt-1 font-medium">Vite + Pages</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-gray-500">UI</p>
            <p className="mt-1 font-medium">Tailwind + Sonner</p>
          </div>
        </section>
      </main>
    </div>
  );
}
