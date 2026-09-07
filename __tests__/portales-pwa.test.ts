import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'

describe('portales y volver mañana', () => {
  it('el bundle de itch apunta al draft (/play/), no al home', () => {
    const src = readFileSync('scripts/data/build-bundle-itchio.mjs', 'utf8')
    expect(src).toContain('/play/')
    expect(src).toContain('utm_source=itchio')
  })

  it('existe el service worker y el manifiesto de app', () => {
    expect(existsSync('public/sw.js')).toBe(true)
    const man = JSON.parse(readFileSync('public/manifest.json', 'utf8'))
    expect(man.display).toBe('standalone')
    expect(man.icons.length).toBeGreaterThanOrEqual(2)
  })

  it('la barra de compartir tiene un CTA de ficha, no solo iconitos', () => {
    const src = readFileSync('components/ShareBar.tsx', 'utf8')
    expect(src).toContain('Compartir con la ficha')
  })

  it('el ticker no se muestra embebido en un portal', () => {
    const src = readFileSync('components/TickerNovedades.tsx', 'utf8')
    expect(src).toContain('useEmbebido')
    expect(src).toContain('embebido')
  })
})
