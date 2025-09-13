// Mocked Anoma intent helpers
export function createIntent({ from, to, amount }) {
  return {
    type: 'payment',
    from,
    to,
    amount,
    timestamp: Date.now(),
  }
}

export async function submitToSolver({ intent, signature }) {
  console.log('Intent submitted to solver:', intent, signature)
  return true
}