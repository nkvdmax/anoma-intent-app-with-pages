import React, { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { useAccount, useChainId } from "wagmi";
import Wallet from "./Wallet";

export default function App() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [intentText, setIntentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);

  const canSubmit = useMemo(() => {
    return intentText.trim().length >= 3 && isConnected && !submitting;
  }, [intentText, isConnected, submitting]);

  async function submitIntent() {
    if (!isConnected) {
      toast.error("ϳ������ �������� ����� ���������.");
      return;
    }
    const text = intentText.trim();
    if (text.length < 3) {
      toast.warning("����� ���� � 3 �������.");
      return;
    }

    setSubmitting(true);
    toast.loading("³�������� ������");

    try {
      // ?? ��������������� endpoint. ������ �� ������� solver/API.
      const res = await fetch("https://httpbin.org/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: text,
          from: address,
          chainId,
          ts: Date.now(),
        }),
      });

      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();

      const item = {
        id: crypto.randomUUID(),
        text,
        chainId,
        address,
        time: new Date().toISOString(),
        echo: data?.json || {},
      };
      setHistory((prev) => [item, ...prev].slice(0, 10));

      toast.success("������ ����������!");
      setIntentText("");
    } catch (e) {
      toast.error(`������� ��������: ${e.message}`);
    } finally {
      setSubmitting(false);
      toast.dismiss(); // �������� �����
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" richColors />
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold">
            <span className="text-indigo-600">Anoma</span> Intent Prototype
          </h1>
          <a
            className="text-sm text-indigo-600 hover:text-indigo-700"
            href="/anoma-intent-app-with-pages/"
          >
            /anoma-intent-app-with-pages
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* �������� + ��������� ����� */}
        <Wallet />

        {/* ����� ������� */}
        <section className="bg-white rounded-xl border shadow-sm p-4 space-y-4">
          <div className="font-medium flex items-center gap-2">
            <span>?</span>
            <span>Tailwind</span>
          </div>
          <p className="text-slate-600">
            ���� �� ����� ��������� ������ � ���������� ����� � Tailwind ���������� ���������.
          </p>

          <div className="flex gap-3">
            <input
              className="flex-1 rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Intent note (����-���� �����)�"
              value={intentText}
              onChange={(e) => setIntentText(e.target.value)}
            />
            <button
              onClick={submitIntent}
              disabled={!canSubmit}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Submitting�" : "Submit Intent"}
            </button>
          </div>
        </section>

        {/* ����-�������� */}
        <section className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Build</p>
            <p className="mt-1 font-medium">Vite + Pages</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">UI</p>
            <p className="mt-1 font-medium">Tailwind</p>
          </div>
          <div className="rounded-xl border bg-white p-4">
            <p className="text-sm text-slate-500">Notifications</p>
            <p className="mt-1 font-medium">Sonner</p>
          </div>
        </section>

        {/* ������ ������� */}
        <section className="bg-white rounded-xl border shadow-sm p-4">
          <div className="font-medium mb-3">������ ������� (��������)</div>
          {history.length === 0 ? (
            <p className="text-slate-500 text-sm">���� �� ��������.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li key={h.id} className="border rounded-lg p-3">
                  <div className="text-sm text-slate-500">
                    {new Date(h.time).toLocaleString()} � Chain {h.chainId}
                  </div>
                  <div className="mt-1 font-medium">{h.text}</div>
                  <div className="text-xs text-slate-500 mt-1">{h.address}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
