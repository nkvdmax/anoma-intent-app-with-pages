export async function executeEvm(plan){
  if(!(window.ethereum)) throw new Error('No EVM wallet');
  // тут можна підставити контракт/ABI; зараз тільки прев’ю
  return { txHash: null, submitted:false, note:'EVM execute stub' };
}
