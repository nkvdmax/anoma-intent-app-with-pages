import React from "react";
import { Toaster } from "sonner";
import IntentBuilder from "./IntentBuilder.jsx";
import History from "./History.jsx";
import Wallet from "./Wallet.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="top-right" />
      <header className="p-6 text-center border-b border-gray-200">
        <h1 className="text-2xl font-bold text-indigo-600">
          Anoma Intent Prototype
        </h1>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <Wallet />
        <IntentBuilder />
        <History />
      </main>
    </div>
  );
}

