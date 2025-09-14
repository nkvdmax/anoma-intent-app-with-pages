import React from 'react';
import { Toaster } from 'sonner';
import IntentBuilder from './IntentBuilder.jsx';
import History from './History.jsx';

export default function App() {
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900'>
      <Toaster position='top-right' richColors />

      <header className='border-b bg-white'>
        <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-xl sm:text-2xl font-semibold'>
            <span className='text-indigo-600'>Anoma</span> Intent Prototype
          </h1>
          <a
            className='text-sm text-indigo-600 hover:text-indigo-700'
            href='https://nkvdmax.github.io/anoma-intent-app-with-pages/'
          >
            /anoma-intent-app-with-pages
          </a>
        </div>
      </header>

      <main className='max-w-6xl mx-auto px-4 py-8 space-y-8'>
        {/* Tailwind quick check */}
        <section className='bg-white rounded-xl shadow-sm border p-6 space-y-2'>
          <h2 className='text-lg font-medium'>Tailwind</h2>
          <p className='text-gray-600'>
            If you can see a colored button and normal text — Tailwind is working correctly.
          </p>
          <button className='rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 active:bg-indigo-800'>
            Submit Intent
          </button>
        </section>

        {/* Builder */}
        <IntentBuilder />

        {/* Status cards */}
        <section className='grid sm:grid-cols-3 gap-4'>
          <div className='rounded-xl border bg-white p-4'>
            <p className='text-sm text-gray-500'>Build</p>
            <p className='mt-1 font-medium'>Vite + Pages</p>
          </div>
          <div className='rounded-xl border bg-white p-4'>
            <p className='text-sm text-gray-500'>UI</p>
            <p className='mt-1 font-medium'>Tailwind</p>
          </div>
          <div className='rounded-xl border bg-white p-4'>
            <p className='text-sm text-gray-500'>Notifications</p>
            <p className='mt-1 font-medium'>Sonner</p>
          </div>
        </section>

        {/* History */}
        <History />
      </main>
    </div>
  );
}
