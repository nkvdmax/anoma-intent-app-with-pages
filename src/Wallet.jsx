import React from "react";
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

export default function Wallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, status: connectStatus } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain, status: switchStatus, error: switchError } = useSwitchChain();

  const short = (a) => a ? `${a.slice(0,6)}пїЅ${a.slice(-4)}` : "";

  return (
    <div className="bg-white rounded-xl border shadow-sm p-4 space-y-3">
      <div className="font-medium flex items-center gap-2">
        <span>??</span> <span>Wallet</span>
      </div>

      {!isConnected ? (
        <div className="flex gap-2">
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => connect({ connector: c })}
              className="rounded-md bg-indigo-600 px-3 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
              disabled={!c.ready || connectStatus === "pending"}
              title={!c.ready ? "Connector not ready" : ""}
            >
              {connectStatus === "pending" ? "ConnectingпїЅ" : `Connect ${c.name}`}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-sm">
            {short(address)}
          </span>

          <span className="px-2 py-1 rounded-md bg-violet-100 text-violet-700 text-sm">
            {chainId === mainnet.id ? "Mainnet" : chainId === sepolia.id ? "Sepolia" : `Chain ${chainId}`}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() => switchChain({ chainId: mainnet.id })}
              className="rounded-md border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
              disabled={switchStatus === "pending" || chainId === mainnet.id}
            >
              Mainnet
            </button>
            <button
              onClick={() => switchChain({ chainId: sepolia.id })}
              className="rounded-md border px-3 py-1.5 hover:bg-slate-50 disabled:opacity-50"
              disabled={switchStatus === "pending" || chainId === sepolia.id}
            >
              Sepolia
            </button>
            <button
              onClick={() => disconnect()}
              className="rounded-md border px-3 py-1.5 hover:bg-slate-50"
            >
              Disconnect
            </button>
          </div>

          {switchError && (
            <div className="text-sm text-red-600">
              {switchError.shortMessage || switchError.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
