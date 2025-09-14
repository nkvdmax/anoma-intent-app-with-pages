export async function submitToSolver(bundle) {
  // ���: ������ ��������� ����� � ��������� ID + echo-���������
  await new Promise(r => setTimeout(r, 600));
  const id = crypto.randomUUID();
  return {
    id,
    received: { hash: bundle?.hash, scheme: bundle?.signed?.scheme || null },
    status: 'queued',
  };
}
