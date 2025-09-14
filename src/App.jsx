import React, { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";

function short(addr) {
  if (!addr) return "—";
  return addr.length > 12 ? addr.slice(0, 6) + "…" + addr.slice(-4) : addr;
}

function Section({ title, icon, children }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-slate-100">{icon}</span>
        <h2 className="text-lg font-medium">{title}</h2>
      </div>
      {children}
    </section>
  );
}

// ---------- EVM target network (Sepolia) ----------
const EVM_TARGET = {
  chainIdHex: "0xaa36a7", // 11155111
  name: "Sepolia",
  params: {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.sepolia.org", "https://sepolia.infura.io/v3/"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

export default function App() {
  // -------- EVM --------
  const [evmAddress, setEvmAddress] = useState("");
  const [evmChain, setEvmChain] = useState("");
  const evmAvailable = typeof window !== "undefined" && !!window.ethereum;
  const onTarget = (evmChain || "").toLowerCase() === EVM_TARGET.chainIdHex;

  async function getChainId() {
    const ch = await window.ethereum.request({ method: "eth_chainId" });
    setEvmChain(ch ?? "");
    return ch;
  }

  async function switchEvmNetwork() {
    if (!evmAvailable) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: EVM_TARGET.chainIdHex }],
      });
      await getChainId();
      toast.success("Switched to " + EVM_TARGET.name);
    } catch (err) {
      if (err?.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [EVM_TARGET.params],
          });
          await getChainId();
          toast.success("Added & switched to " + EVM_TARGET.name);
        } catch (addErr) {
          console.error(addErr);
          toast.error(addErr?.message ?? "Failed to add network");
        }
      } else {
        console.error(err);
        toast.error(err?.message ?? "Failed to switch network");
      }
    }
  }

  async function ensureTargetNetwork() {
    const id = (await getChainId())?.toLowerCase();
    if (id !== EVM_TARGET.chainIdHex) {
      toast.info("Switching to " + EVM_TARGET.name + "…");
      await switchEvmNetwork();
    }
  }

  async function connectEvm() {
    try {
      if (!evmAvailable) {
        toast.error("No EVM wallet found (window.ethereum not present).");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      await getChainId();
      setEvmAddress(accounts?.[0] ?? "");
      toast.success("EVM wallet connected");
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "Failed to connect EVM wallet");
    }
  }

  function disconnectEvm() {
    setEvmAddress("");
    setEvmChain("");
    toast.info("EVM disconnected locally");
  }

  async function signEvm() {
    try {
      if (!evmAddress) {
        toast.error("Connect EVM first");
        return;
      }
      await ensureTargetNetwork();
      const msg = "Hello from Anoma Intent Prototype (EVM)";
      const sig = await window.ethereum.request({
        method: "personal_sign",
        params: [msg, evmAddress],
      });
      toast.success("EVM signed ?");
      console.log("EVM signature:", sig);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "EVM sign failed");
    }
  }

  // -------- Solana --------
  const [solAddress, setSolAddress] = useState("");
  const sol = (typeof window !== "undefined" && (window.solana || window.phantom?.solana)) || null;
  const solAvailable = !!sol;

  async function connectSol() {
    try {
      if (!solAvailable) {
        toast.error("No Solana wallet found (Phantom or compatible).");
        return;
      }
      const res = await sol.connect();
      const addr = (res?.publicKey ?? sol.publicKey)?.toString();
      setSolAddress(addr ?? "");
      toast.success("Solana wallet connected");
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "Failed to connect Solana wallet");
    }
  }

  async function disconnectSol() {
    try { if (sol?.disconnect) await sol.disconnect(); } catch {}
    setSolAddress("");
    toast.info("Solana disconnected");
  }

  async function signSol() {
    try {
      if (!solAddress) {
        toast.error("Connect Solana first");
        return;
      }
      if (!sol?.signMessage) {
        toast.error("Wallet does not support signMessage");
        return;
      }
      const msg = new TextEncoder().encode("Hello from Anoma Intent Prototype (Solana)");
      const { signature } = await sol.signMessage(msg, "utf8");
      toast.success("Solana signed ?");
      console.log("Solana signature:", signature);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "Solana sign failed");
    }
  }

  // -------- Sui --------
  const [suiAddress, setSuiAddress] = useState("");
  const sui = useMemo(() => {
    if (typeof window === "undefined") return null;
    return window.sui || window.suiWallet || null;
  }, []);
  const suiAvailable = !!sui;

  async function connectSui() {
    try {
      if (!suiAvailable || !sui.request) {
        toast.error("No Sui wallet found or unsupported provider API.");
        return;
      }
      try {
        await sui.request({
          method: "sui_requestPermissions",
          params: [{ permissions: ["viewAccount", "suggestTransactions"] }],
        });
      } catch {}
      const accounts = await sui.request({ method: "sui_accounts" });
      const addr = Array.isArray(accounts) ? accounts[0] : accounts?.data?.[0];
      if (!addr) throw new Error("No Sui accounts returned");
      setSuiAddress(addr);
      toast.success("Sui wallet connected");
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "Failed to connect Sui wallet");
    }
  }

  function disconnectSui() {
    setSuiAddress("");
    toast.info("Sui disconnected");
  }

  async function signSui() {
    try {
      if (!suiAddress) {
        toast.error("Connect Sui first");
        return;
      }
      if (!sui?.request) {
        toast.error("Sui provider does not support signMessage");
        return;
      }
      const message = new TextEncoder().encode("Hello from Anoma Intent Prototype (Sui)");
      const res = await sui.request({
        method: "sui_signMessage",
        params: { message },
      });
      toast.success("Sui signed ?");
      console.log("Sui signature:", res);
    } catch (err) {
      console.error(err);
      toast.error(err?.message ?? "Sui sign failed");
    }
  }

  // -------- Intent demo --------
  const [note, setNote] = useState("");

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
        <Section title="Wallet" icon="??">
          <div className="flex flex-wrap gap-3">
            {/* EVM */}
            {!evmAddress ? (
              <button
                type="button"
                className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 active:bg-indigo-200"
                onClick={connectEvm}
              >
                Connect EVM
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                  EVM: {short(evmAddress)}{" "}
                  {evmChain && (
                    <span className={!onTarget ? "text-rose-600" : "opacity-70"}>
                      ({evmChain}) {!onTarget && "? Sepolia"}
                    </span>
                  )}
                </span>
                {!onTarget && (
                  <button
                    type="button"
                    className="rounded-lg bg-violet-600 text-white px-3 py-2 text-sm hover:bg-violet-700"
                    onClick={switchEvmNetwork}
                  >
                    Switch to Sepolia
                  </button>
                )}
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                  onClick={signEvm}
                >
                  Sign
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                  onClick={disconnectEvm}
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Solana */}
            {!solAddress ? (
              <button
                type="button"
                className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 active:bg-indigo-200"
                onClick={connectSol}
              >
                Connect Solana
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                  Solana: {short(solAddress)}
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                  onClick={signSol}
                >
                  Sign
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                  onClick={disconnectSol}
                >
                  Disconnect
                </button>
              </div>
            )}

            {/* Sui */}
            {!suiAddress ? (
              <button
                type="button"
                className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 active:bg-indigo-200"
                onClick={connectSui}
              >
                Connect Sui
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
                  Sui: {short(suiAddress)}
                </span>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                  onClick={signSui}
                >
                  Sign
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-slate-100 px-3 py-2 text-sm hover:bg-slate-200"
                  onClick={disconnectSui}
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </Section>

        {/* Tailwind check + intent form */}
        <Section title="Tailwind" icon="?">
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
                toast.success("Intent submitted!");
                setNote("");
              }}
            >
              Submit Intent
            </button>
          </div>
        </Section>

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
