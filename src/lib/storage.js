const KEY = "anoma.intent.history.v1";

export function loadHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}
export function saveHistory(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr || []));
}
export function pushHistory(item) {
  const arr = loadHistory();
  arr.unshift({ id: crypto.randomUUID(), ts: Date.now(), ...item });
  saveHistory(arr);
  return arr;
}
export function removeHistory(id) {
  const arr = loadHistory().filter(x => x.id !== id);
  saveHistory(arr);
  return arr;
}
