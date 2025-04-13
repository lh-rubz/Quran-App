"use client"

import { useState, useEffect, useRef } from "react"

export function useTafsirText(ayahNumber: number, tafsirId: string) {
  const [tafsirText, setTafsirText] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const previousAyah = useRef<number>(0)
  const previousTafsir = useRef<string>("")

  useEffect(() => {
    // Only fetch if ayah or tafsir has changed
    if (previousAyah.current === ayahNumber && previousTafsir.current === tafsirId) {
      return
    }

    async function fetchTafsir() {
      // Don't fetch if no ayah number or tafsir is selected
      if (!ayahNumber || !tafsirId) {
        setTafsirText("")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        // First try the alquran.cloud API
        const response = await fetch(`https://api.alquran.cloud/v1/ayah/${ayahNumber}/${tafsirId}`)

        if (!response.ok) {
         

       
          setTafsirText(response.text || "التفسير غير متوفر لهذه الآية")
          return
        }

        const data = await response.json()

        if (data.code === 200 && data.status === "OK") {
          setTafsirText(data.data.text)
        } else {
          throw new Error(data.status || "Unknown error")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        console.error("Error fetching tafsir:", err)
        setTafsirText("التفسير غير متوفر لهذه الآية")
      } finally {
        setLoading(false)
        // Update refs to current values
        previousAyah.current = ayahNumber
        previousTafsir.current = tafsirId
      }
    }

    fetchTafsir()
  }, [ayahNumber, tafsirId])

  return { tafsirText, loading, error }
}
