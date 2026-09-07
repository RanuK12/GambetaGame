import { describe, it, expect } from 'vitest'
import { spinSquadWithPity } from '@/lib/game-engine'
import { mulberry32, seedDesdeTexto } from '@/lib/prng'
import type { Player, Squad } from '@/lib/types'

function planteles(): Squad[] {
  return ['boca-juniors', 'river-plate', 'racing-club', 'independiente', 'san-lorenzo'].flatMap((clubId) =>
    [2018, 2019, 2020, 2021].map((año) => ({
      id: `${clubId}-${año}`,
      clubId,
      season: String(año),
      competition: 'Liga Profesional',
      label: `${clubId} ${año}`,
      playerIds: [`${clubId}-${año}-p`] as [string, ...string[]],
    })),
  )
}

const SIN_PITY = { consecutiveLow: 0, pityActive: false, spinsSinEstrella: 0 }
const SIN_JUGADORES: Player[] = []

describe('el mismo seed produce el mismo bombo', () => {
  it('dos PRNG con el mismo seed eligen el mismo plantel', () => {
    const squads = planteles()
    const s1 = spinSquadWithPity(squads, SIN_JUGADORES, SIN_PITY, undefined, undefined, mulberry32(seedDesdeTexto('abc')))
    const s2 = spinSquadWithPity(squads, SIN_JUGADORES, SIN_PITY, undefined, undefined, mulberry32(seedDesdeTexto('abc')))
    expect(s1.id).toBe(s2.id)
  })

  it('un seed distinto puede (y suele) dar otro plantel', () => {
    const squads = planteles()
    const ids = new Set<string>()
    for (const texto of ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho']) {
      ids.add(spinSquadWithPity(squads, SIN_JUGADORES, SIN_PITY, undefined, undefined, mulberry32(seedDesdeTexto(texto))).id)
    }
    expect(ids.size).toBeGreaterThan(1)
  })
})
