import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'

/**
 * Las páginas de equipos históricos mandan al draft con `?club=`. Si el draft no lee ese
 * parámetro, el hincha cae al bombo entero y el link del club no sirve para outreach.
 */
describe('el draft respeta el club del link', () => {
  it('lee el query club y recorta el bombo', () => {
    const src = readFileSync('app/draft/page.tsx', 'utf8')
    expect(src).toContain('sp.get("club")')
    expect(src).toContain('s.clubId === clubId')
  })

  it('las fichas de equipos históricos pegan ese query', () => {
    const src = readFileSync('app/equipos/[slug]/page.tsx', 'utf8')
    expect(src).toContain('club=${e.clubId}')
    expect(src).toContain('/draft?mode=clasico&club=')
  })

  it('el seed del chat también está en la URL del draft', () => {
    const src = readFileSync('app/draft/page.tsx', 'utf8')
    expect(src).toContain('sp.get("seed")')
    expect(src).toContain('CopiarDesafio')
  })
})
