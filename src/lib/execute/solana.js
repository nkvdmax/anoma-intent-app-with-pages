export async function executeSolana(plan){
  if(!(window.solana?.signAndSendTransaction)) throw new Error('No Solana wallet');
  return { sig:null, submitted:false, note:'Solana execute stub' };
}
