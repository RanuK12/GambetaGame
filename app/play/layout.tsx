import type { Metadata } from 'next'

/**
 * La URL que se le da a un portal: arranca en el draft, no en el home.
 *
 * CrazyGames mide el tiempo hasta que se puede jugar. La portada explica el juego; el que
 * llega desde un portal ya eligió jugar. /play/ es el draft con UTM de portal.
 */
export const metadata: Metadata = {
  title: 'Jugar Gambeta | Draft del fútbol argentino',
  description: 'Armá tu 11 con planteles reales del fútbol argentino y simulá el torneo. Gratis, en el navegador.',
  alternates: { canonical: '/play/' },
  robots: { index: false, follow: true },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
