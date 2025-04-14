"use client"

import { useState, useEffect, useRef } from "react"
import { useLocalStorage } from "./use-local-storage"

export function useTafsir() {
  interface Tafsir {
    identifier: string
    language: string
    name: string
    englishName: string
  }

  const [tafsirs, setTafsirs] = useState<Tafsir[]>([])
  const [selectedTafsir, setSelectedTafsir] = useLocalStorage<string>("selectedTafsir", "ar.muyassar")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initialFetchDone = useRef(false)

  useEffect(() => {
    async function fetchTafsirs() {
      // Prevent multiple fetches
      if (initialFetchDone.current) return

      try {
        setLoading(true)
        const response = await fetch("https://api.alquran.cloud/v1/edition/type/tafsir")

        if (!response.ok) {
          throw new Error("Failed to fetch tafsirs")
        }

        const data = await response.json()

        if (data.code === 200) {
          setTafsirs(data.data)
          initialFetchDone.current = true

          // Only set default tafsir if none is selected and we have data
          if (!selectedTafsir && data.data.length > 0) {
            setSelectedTafsir(data.data[0].identifier)
          }
        } else {
          throw new Error(data.status || "Unknown error")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        console.error("Error fetching tafsirs:", err)

        // Provide some default tafsirs if API fails
        const defaultTafsirs = [
          { identifier: "ar.muyassar", language: "ar", name: "تفسير الميسر", englishName: "Muyassar" },
          { identifier: "ar.qurtubi", language: "ar", name: "تفسير القرطبي", englishName: "Al-Qurtubi" },
          { identifier: "ar.kathir", language: "ar", name: "تفسير ابن كثير", englishName: "Ibn Kathir" },
        ]
        setTafsirs(defaultTafsirs)
        initialFetchDone.current = true

        if (!selectedTafsir) {
          setSelectedTafsir(defaultTafsirs[0].identifier)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchTafsirs()
  }, [selectedTafsir, setSelectedTafsir])

  return { tafsirs, selectedTafsir, setSelectedTafsir, loading, error }
}
