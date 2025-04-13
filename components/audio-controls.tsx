"use client"

import { StopCircle } from "lucide-react"

interface AudioControlsProps {
  theme: string
  isPlaying: boolean
  currentSurah: number | null
  currentAyah: number | null
  stopAllAudio: () => void
}

export function AudioControls({
  theme,
  isPlaying,
  currentSurah,
  currentAyah,
  stopAllAudio,
}: AudioControlsProps) {
  if (!isPlaying) return null

  return (
    <div
      className={`border-t p-4 ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-4">
        <button
          className={`p-3 rounded-full ${
            theme === "dark" ? "bg-red-600 text-white hover:bg-red-700" : "bg-red-600 text-white hover:bg-red-700"
          }`}
          onClick={stopAllAudio}
        >
          <StopCircle className="h-5 w-5" />
        </button>
        <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
          {currentSurah && currentAyah ? `Playing Surah ${currentSurah}, Ayah ${currentAyah}` : ""}
        </div>
      </div>
    </div>
  )
}