export async function submitToSolver(bundle) {
  // Мок: імітуємо мережевий запит і повертаємо ID + echo-результат
  await new Promise(r => setTimeout(r, 600));
  const id = crypto.randomUUID();
  return {
    id,
    received: { hash: bundle?.hash, scheme: bundle?.signed?.scheme || null },
    status: 'queued',
  };
}
