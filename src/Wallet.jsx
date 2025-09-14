import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

function short(addr, size = 4) {
  if (!addr) return '';
  const s = String(addr);
  if (s.length <= 2 * size + 2) return s;

  const head = s.slice(0, 2 + size);
  const tail = s.slice(-size);
  return `${head}...${tail}`; // <-- ASCII '...'
}


export default function Wallet() {
  const [evm, setEvm] = useState({ address: '', chainId: '' });
  const [sol, setSol] = useState({ publicKey: '' });
  const [sui, setSui] = useState({ address: '' });

  const has = useMemo(
    () => ({
      evm: !!window.ethereum,
      sol: !!window.solana,
      sui: !!window.sui || !!window.suiWallet || !!window.__walletStandard,
    }),
    []
  );

  // ---------- EVM ----------
  async function connectEvm() {
    try {
      if (!window.ethereum) throw new Error('No injected EVM wallet (MetaMask/Rabby)');
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const address = accounts?.[0] || '';
      if (!address) throw new Error('Account not returned');
      setEvm({ address, chainId });
      toast.success('EVM connected');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Failed to connect EVM');
    }
  }
  function disconnectEvm() { setEvm({ address: '', chainId: '' }); }

  // ---------- Solana ----------
  async function connectSolana() {
    try {
      const provider = window.solana;
      if (!provider?.connect) throw new Error('No Solana wallet (Phantom/Magic Eden/Backpack)');
      const { publicKey } = await provider.connect();
      const pk = publicKey?.toString?.() || '';
      if (!pk) throw new Error('Public key not returned');
      setSol({ publicKey: pk });
      toast.success('Solana connected');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Failed to connect Solana');
    }
  }
  function disconnectSolana() { setSol({ publicKey: '' }); }

  // ---------- Sui ----------
  async function connectSui() {
    try {
      if (window.sui?.request) {
        try {
          await window.sui.request({ method: 'sui_requestPermissions', params: [['viewAccount']] });
        } catch {}
        let accounts = [];
        try {
          accounts = await window.sui.request({ method: 'sui_accounts' });
        } catch {
          try { accounts = await window.sui.request({ method: 'sui_requestAccounts' }); } catch {}
        }
        const address = Array.isArray(accounts) ? accounts[0] : accounts?.data?.[0];
        if (!address) throw new Error('No Sui account returned');
        setSui({ address });
        toast.success('Sui connected (sui API)');
        return;
      }
      if (window.suiWallet?.getAccounts) {
        const res = await window.suiWallet.getAccounts();
        const address = res?.[0]?.address || '';
        if (!address) throw new Error('No Sui account returned');
        setSui({ address });
        toast.success('Sui connected (suiWallet API)');
        return;
      }
      if (window.__walletStandard) {
        throw new Error('Detected Sui Wallet Standard — enable a Sui wallet and reload');
      }
      throw new Error('No Sui wallet detected');
    } catch (e) {
      console.error(e);
      toast.error(e?.message || 'Failed to connect Sui');
    }
  }
  function disconnectSui() { setSui({ address: '' }); }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => toast.success('Copied'));
  }

  return (
    <section className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
      <h2 className="text-lg font-medium">Wallet</h2>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={connectEvm}
          className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 disabled:opacity-50"
          disabled={!has.evm}
          title={has.evm ? 'Connect EVM (MetaMask/Rabby)' : 'No EVM wallet detected'}
        >Connect EVM</button>

        <button
          onClick={connectSolana}
          className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 disabled:opacity-50"
          disabled={!has.sol}
          title={has.sol ? 'Connect Solana (Phantom etc.)' : 'No Solana wallet detected'}
        >Connect Solana</button>

        <button
          onClick={connectSui}
          className="rounded-lg bg-indigo-50 text-indigo-700 px-3 py-2 text-sm hover:bg-indigo-100 disabled:opacity-50"
          disabled={!has.sui}
          title={has.sui ? 'Connect Sui' : 'No Sui wallet detected'}
        >Connect Sui</button>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-xl border p-3">
          <p className="text-sm text-gray-500 mb-1">EVM</p>
          {evm.address ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{short(evm.address, 6)}</span>
              <button className="text-xs text-indigo-600 hover:underline" onClick={() => copy(evm.address)}>copy</button>
              <button className="text-xs text-rose-600 hover:underline ml-auto" onClick={disconnectEvm}>disconnect</button>
            </div>
          ) : (<p className="text-sm text-slate-500">—</p>)}
        </div>

        <div className="rounded-xl border p-3">
          <p className="text-sm text-gray-500 mb-1">Solana</p>
          {sol.publicKey ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{short(sol.publicKey, 6)}</span>
              <button className="text-xs text-indigo-600 hover:underline" onClick={() => copy(sol.publicKey)}>copy</button>
              <button className="text-xs text-rose-600 hover:underline ml-auto" onClick={disconnectSolana}>disconnect</button>
            </div>
          ) : (<p className="text-sm text-slate-500">—</p>)}
        </div>

        <div className="rounded-xl border p-3">
          <p className="text-sm text-gray-500 mb-1">Sui</p>
          {sui.address ? (
            <div className="flex items-center gap-2">
              <span className="font-medium">{short(sui.address, 6)}</span>
              <button className="text-xs text-indigo-600 hover:underline" onClick={() => copy(sui.address)}>copy</button>
              <button className="text-xs text-rose-600 hover:underline ml-auto" onClick={disconnectSui}>disconnect</button>
            </div>
          ) : (<p className="text-sm text-slate-500">—</p>)}
        </div>
      </div>
    </section>
  );
}
