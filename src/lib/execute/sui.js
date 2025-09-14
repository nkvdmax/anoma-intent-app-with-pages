export async function executeSui(plan){
  if(!(window.sui?.request)) throw new Error('No Sui wallet');
  return { digest:null, submitted:false, note:'Sui execute stub' };
}
