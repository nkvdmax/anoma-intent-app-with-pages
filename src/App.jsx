import React, { useState } from 'react'
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { createIntent, submitToSolver } from './anomaApplib'

export default function App() {
  const [account, setAccount] = useState(null)
  const [status, setStatus] = useState('')

  async function connectWallet() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    setAccount(address)
  }

  async function sendIntent() {
    setStatus('Creating intent...')
    const intent = createIntent({
      from: account,
      to: '0xReceiverAddress',
      amount: '1 ETH',
    })
    setStatus('Signing intent...')
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(JSON.stringify(intent))
    setStatus('Submitting intent...')
    await submitToSolver({ intent, signature })
    setStatus('Intent submitted!')
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Anoma Intent Prototype</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <button onClick={sendIntent}>Send Intent</button>
        </>
      )}
      <p>{status}</p>
    </div>
  )
}