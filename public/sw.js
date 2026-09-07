/* Service worker de Gambeta: alcanza para instalar la app y avisar el reto diario.
   No cachea el juego: un SW que sirve HTML viejo deja a la gente en una versión rota. */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/draft/?mode=clasico'
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((ventanas) => {
      for (const w of ventanas) {
        if ('focus' in w) {
          w.navigate?.(url)
          return w.focus()
        }
      }
      return self.clients.openWindow(url)
    }),
  )
})

self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'reto-diario') return
  event.waitUntil(
    self.registration.showNotification('El reto de hoy ya está', {
      body: 'Mismo bombo para todos. Seguí la racha.',
      icon: '/logos/gambeta-192.png',
      badge: '/logos/gambeta-192.png',
      data: { url: '/?utm_source=aviso&utm_medium=notificacion&utm_campaign=reto_diario' },
    }),
  )
})
