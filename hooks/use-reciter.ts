"use client"

import { useState, useEffect, useRef } from "react"

import type { Reciter } from "@/types"
import { useLocalStorage } from "./use-local-storage"

export function useReciter() {
  const [reciters, setReciters] = useState<Reciter[]>([])
  const [selectedReciter, setSelectedReciter] = useLocalStorage<string>("selectedReciter", "ar.alafasy")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const initialFetchDone = useRef(false)

  useEffect(() => {
    async function fetchReciters() {
      if (initialFetchDone.current) return

      try {
        setLoading(true)
        const response = await fetch("https://api.alquran.cloud/v1/edition?format=audio")

        if (!response.ok) {
          throw new Error("Failed to fetch reciters")
        }

        const data = await response.json()

        if (data.code === 200 && data.status === "OK") {
          const transformedReciters = data.data.map((reciter: {
            identifier: string
            language: string
            name: string
            englishName: string
            format: string
            type: string
          }) => ({
            identifier: reciter.identifier,
            language: reciter.language,
            name: reciter.name,
            englishName: reciter.englishName,
            format: reciter.format,
            type: reciter.type,
          }))

          setReciters(transformedReciters)
          initialFetchDone.current = true

          // Only set default reciter if none is selected and we have reciters
          if (!selectedReciter && transformedReciters.length > 0) {
            setSelectedReciter(transformedReciters[0].identifier)
          }
        } else {
          throw new Error("Invalid reciters data format")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        console.error("Error fetching reciters:", err)
        initialFetchDone.current = true
      } finally {
        setLoading(false)
      }
    }

    fetchReciters()
  }, [selectedReciter, setSelectedReciter])

  return { reciters, selectedReciter, setSelectedReciter, loading, error }
}
