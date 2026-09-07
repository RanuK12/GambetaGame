"use client"

import { useEffect, useState } from "react"
import { trackEvent, EVENTOS } from "@/components/Analytics"
import { useEmbebido } from "@/lib/embebido"
import { loadDaily } from "@/lib/daily-progress"
import {
  registrarAviso,
  pedirAvisoReto,
  puedeInstalar,
  instalarApp,
  appInstalada,
} from "@/lib/pwa"

/**
 * El gancho de volver mañana, pegado al reto diario.
 *
 * Sin un aviso ni la app en el teléfono, el reto existe y no lo juega nadie: 34 personas en 28
 * días. El aviso usa la notificación del navegador (sin servidor). Instalar como app se ofrece
 * recién con dos días de racha, no antes.
 */
export default function VolverManana() {
  const embebido = useEmbebido()
  const [streak, setStreak] = useState(0)
  const [avisoOn, setAvisoOn] = useState(false)
  const [instalar, setInstalar] = useState(false)
  const [instalada, setInstalada] = useState(false)

  useEffect(() => {
    registrarAviso()
    setStreak(loadDaily().streak)
    setAvisoOn(typeof Notification !== "undefined" && Notification.permission === "granted")
    setInstalada(appInstalada())
    const off = puedeInstalar(() => setInstalar(true))
    return off
  }, [])

  if (embebido) return null
  if (streak < 1) return null

  return (
    <div className="mt-4 flex flex-col gap-2 sm:items-end">
      {!avisoOn && (
        <button
          type="button"
          onClick={async () => {
            const ok = await pedirAvisoReto()
            setAvisoOn(ok)
            if (ok) trackEvent(EVENTOS.avisoReto, { via: "reto_diario" })
          }}
          className="rounded-2xl border border-[#74ACDF]/30 bg-[#74ACDF]/10 px-4 py-2 font-sport text-[10px] font-black uppercase tracking-widest text-[#9CCBF0] transition-colors hover:border-[#74ACDF]/60"
        >
          Avisame mañana del reto
        </button>
      )}
      {instalar && !instalada && streak >= 2 && (
        <button
          type="button"
          onClick={async () => {
            const ok = await instalarApp()
            if (ok) {
              setInstalada(true)
              setInstalar(false)
              trackEvent(EVENTOS.instalarApp, { racha: streak })
            }
          }}
          className="rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-2 font-sport text-[10px] font-black uppercase tracking-widest text-slate-300 transition-colors hover:border-white/40"
        >
          Instalar la app
        </button>
      )}
    </div>
  )
}
