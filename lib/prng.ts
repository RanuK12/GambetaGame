/**
 * PRNG chico para que dos personas con el mismo `seed` vean el mismo bombo.
 *
 * El draft usa Math.random: un streamer y su chat no pueden jugar la misma ruleta. Con un seed
 * en la URL, el sorteo de planteles queda determinado y el link se puede pegar en un chat.
 */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function seedDesdeTexto(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Código corto para pegar en un chat. */
export function codigoNuevo(): string {
  const n = (Math.floor(Math.random() * 0xffffffff) >>> 0).toString(36)
  return n.padStart(6, '0').slice(0, 8)
}
