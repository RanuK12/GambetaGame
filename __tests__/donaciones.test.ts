import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { mpTiers, mpAlias, stripeTiers } from '@/lib/donations'

/**
 * Las donaciones son URLs públicas (Mercado Pago y Stripe Payment Link). Si se cae el
 * link o se saca el botón, la sección se ve igual y nadie se entera hasta que alguien
 * intenta pagar. Acá se protege que existan, que apunten a los dos medios y que el
 * monto de Stripe sea accesible.
 */
describe('donaciones', () => {
  it('Mercado Pago tiene tres montos y el alias', () => {
    expect(mpAlias).toBe('ranuk.it')
    expect(mpTiers).toHaveLength(3)
    expect(mpTiers.map((t) => t.ars)).toEqual([1000, 2500, 5000])
    for (const t of mpTiers) {
      expect(t.link).toMatch(/^https:\/\/mpago\.la\//)
    }
  })

  it('Stripe tiene un monto accesible y un Payment Link live', () => {
    expect(stripeTiers.length).toBeGreaterThanOrEqual(1)
    const cafe = stripeTiers[0]
    expect(cafe.eur).toBeLessThanOrEqual(5)
    expect(cafe.link).toMatch(/^https:\/\/buy\.stripe\.com\//)
  })

  it('la sección de donar muestra Mercado Pago y Stripe', () => {
    const src = readFileSync('components/DonationSection.tsx', 'utf8')
    expect(src).toContain('mpTiers')
    expect(src).toContain('stripeTiers')
    expect(src).toContain('via: "stripe"')
    expect(src).toContain('via: "mercadopago"')
    expect(src).toContain('id="apoyar"')
  })
})
