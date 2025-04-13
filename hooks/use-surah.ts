"use client"

import { useState, useEffect } from "react"
import type { Surah } from "@/types"

export function useSurah() {
  const [surahs, setSurahs] = useState<Surah[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSurahs() {
      try {
        setLoading(true)
        const response = await fetch("https://api.alquran.cloud/v1/surah")

        if (!response.ok) {
          throw new Error("Failed to fetch surahs")
        }

        const data = await response.json()

        if (data.code === 200 && data.status === "OK") {
          // Verify we have all 114 surahs
          if (data.data.length !== 114) {
            console.warn(`Expected 114 surahs but received ${data.data.length}`)
          }

          // Add a page property to each surah
          const surahsWithPage = data.data.map((surah: any) => ({
            ...surah,
            // In a real app, you would use actual page mapping data
            // For this demo, we'll use a simple formula
            page: Math.ceil(surah.number / 2),
          }))

          setSurahs(surahsWithPage)
        } else {
          throw new Error(data.status || "Unknown error")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        console.error("Error fetching surahs:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchSurahs()
  }, [])

  return { surahs, loading, error }
}
