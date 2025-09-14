import { describe, it, expect } from 'vitest'
import { canonicalizeIntent, sha256Hex } from '../src/lib/canonical.js'

describe('canonical intent', ()=>{
  it('sorts keys & hashes deterministically', async ()=>{
    const a = canonicalizeIntent({asset:'USDC',chain:'EVM',amount:'1',recipient:'0x1'})
    const b = canonicalizeIntent({recipient:'0x1',amount:'1',asset:'USDC',chain:'EVM'})
    expect(JSON.stringify(a)).toBe(JSON.stringify(b))
    const ha = await sha256Hex(JSON.stringify(a))
    const hb = await sha256Hex(JSON.stringify(b))
    expect(ha).toBe(hb)
  })
})
