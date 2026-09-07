"use client"

type BeforeInstall = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

let deferred: BeforeInstall | null = null
const listeners: Array<() => void> = []

function avisar() {
  for (const fn of listeners) fn()
}

/**
 * Escucha `beforeinstallprompt`. Chrome lo dispara una vez: hay que guardarlo y no
 * llamar `prompt()` hasta que el jugador toque.
 */
export function puedeInstalar(onListo: () => void): () => void {
  listeners.push(onListo)
  if (deferred) onListo()
  if (typeof window === "undefined") return () => {}
  const onPrompt = (e: Event) => {
    e.preventDefault()
    deferred = e as BeforeInstall
    avisar()
  }
  window.addEventListener("beforeinstallprompt", onPrompt)
  return () => {
    window.removeEventListener("beforeinstallprompt", onPrompt)
    const i = listeners.indexOf(onListo)
    if (i >= 0) listeners.splice(i, 1)
  }
}

export function appInstalada(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(display-mode: standalone)").matches
}

export async function instalarApp(): Promise<boolean> {
  if (!deferred) return false
  await deferred.prompt()
  const { outcome } = await deferred.userChoice
  deferred = null
  return outcome === "accepted"
}

export async function registrarAviso(): Promise<ServiceWorkerRegistration | null> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return null
  try {
    const reg = await navigator.serviceWorker.register("/sw.js")
    return reg
  } catch {
    return null
  }
}

export async function pedirAvisoReto(): Promise<boolean> {
  if (typeof Notification === "undefined") return false
  const perm = await Notification.requestPermission()
  if (perm !== "granted") return false
  const reg = await registrarAviso()
  try {
    const periodic = (reg as ServiceWorkerRegistration & {
      periodicSync?: { register: (tag: string, opts: { minInterval: number }) => Promise<void> }
    })?.periodicSync
    await periodic?.register("reto-diario", { minInterval: 12 * 60 * 60 * 1000 })
  } catch {
    /* Chrome lo pide con la app instalada; sin eso igual queda el aviso al abrir el sitio. */
  }
  return true
}

/** Si hay permiso y el reto de hoy no se jugó, un aviso al abrir. Una vez por día. */
export function avisoSiFaltaJugar(hechoHoy: boolean): void {
  if (typeof window === "undefined" || typeof Notification === "undefined") return
  if (Notification.permission !== "granted" || hechoHoy) return
  const clave = "gambeta_aviso_reto_ymd"
  const hoy = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`
  try {
    if (localStorage.getItem(clave) === hoy) return
    localStorage.setItem(clave, hoy)
  } catch {
    return
  }
  navigator.serviceWorker?.ready.then((reg) => {
    reg.showNotification("El reto de hoy ya está", {
      body: "Mismo bombo para todos. Seguí la racha.",
      icon: "/logos/gambeta-192.png",
      data: { url: "/draft/?mode=clasico&utm_source=aviso&utm_medium=notificacion&utm_campaign=reto_diario" },
    })
  }).catch(() => {
    /* sin SW: no se avisa, el card del home ya está */
  })
}
