"use client"

import { useState } from "react"
import { trackEvent, EVENTOS } from "@/components/Analytics"
import { useEmbebido } from "@/lib/embebido"

/**
 * Copia el link del mismo bombo. Un streamer o un grupo de WhatsApp juegan la misma ruleta.
 */
export default function CopiarDesafio({ href, className = "" }: { href: string; className?: string }) {
  const [copiado, setCopiado] = useState(false)
  const embebido = useEmbebido()
  if (embebido) return null

  async function copiar() {
    try {
      await navigator.clipboard.writeText(href)
      trackEvent(EVENTOS.compartido, { red: "desafio" })
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sin permiso: el usuario puede copiar a mano si se lo mostramos */
    }
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={copiar}
        className="inline-flex items-center gap-2 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2.5 font-sport text-[11px] font-black uppercase tracking-widest text-amber-200 transition-colors hover:border-amber-300/60"
      >
        {copiado ? "Link copiado" : "Mismo bombo para el chat"}
      </button>
      <p className="mt-1.5 font-sans text-[11px] text-slate-500">
        Pegalo en un grupo o en un stream: todos juegan la misma ruleta.
      </p>
    </div>
  )
}
