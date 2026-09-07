// Donaciones. Los links de pago son públicos por naturaleza (como un Stripe Payment
// Link), así que van acá directo y funcionan sin configurar nada.
// Estático-friendly: son URLs, no requieren servidor ni SDK.

export interface MpTier {
  ars: number
  label: string
  sub: string
  emoji: string
  link: string
}

export interface StripeTier {
  eur: number
  label: string
  sub: string
  emoji: string
  link: string
}

export const mpAlias = 'ranuk.it'

export const mpTiers: MpTier[] = [
  { ars: 1000, label: 'Cafecito', sub: 'Bancá un ratito de servidores', emoji: '☕', link: 'https://mpago.la/2wp44xh' },
  { ars: 2500, label: 'Choripán', sub: 'La que más eligen los hinchas', emoji: '🌭', link: 'https://mpago.la/2qkqmNh' },
  { ars: 5000, label: 'Socio', sub: 'Sos de la comisión directiva', emoji: '🛡️', link: 'https://mpago.la/2KrsELo' },
]

// Stripe Payment Link live, cuenta Ranuk-IT-Solutions. €3 es un cafecito: accesible
// desde afuera, y en el link se puede subir la cantidad si alguien quiere dar más.
export const stripeTiers: StripeTier[] = [
  {
    eur: 3,
    label: 'Cafecito',
    sub: 'Con tarjeta, desde cualquier país',
    emoji: '💳',
    link: 'https://buy.stripe.com/6oU00c6zZ3A24vV2EB4Ja00',
  },
]
