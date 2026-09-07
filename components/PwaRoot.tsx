"use client"

import { useEffect } from "react"
import { registrarAviso } from "@/lib/pwa"
import { useEmbebido } from "@/lib/embebido"

/** Registra el service worker una vez, en el sitio propio. */
export default function PwaRoot() {
  const embebido = useEmbebido()
  useEffect(() => {
    if (embebido) return
    registrarAviso()
  }, [embebido])
  return null
}
