const NS = 'anoma_cache_v1';
function now(){ return Date.now(); }
export function cacheGet(key){
  try{
    const raw = localStorage.getItem(NS+':'+key);
    if(!raw) return null;
    const {v,exp} = JSON.parse(raw);
    if(exp && exp < now()){ localStorage.removeItem(NS+':'+key); return null; }
    return v;
  } catch { return null; }
}
export function cacheSet(key, value, ttlMs=300000){
  try{
    localStorage.setItem(NS+':'+key, JSON.stringify({v:value, exp: now()+ttlMs}));
  } catch {}
}
