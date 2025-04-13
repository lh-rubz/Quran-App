"use client"

import { BookOpen } from "lucide-react"
import { Play, Pause } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { TafsirPanel } from "./tafsir-panel"

interface VerseComponentProps {
  verse: any
  surahNumber: number
  theme: string
  isCurrentVerse: boolean
  isActiveVerse: boolean
  translation: string
  tafsirText: string | null
  tafsirLoading: boolean
  tafsirError: boolean
  activeTab: string
  currentSurah: number | null
  currentAyah: number | null
  handleVerseClick: (surahNumber: number, verseNumber: number) => void
  playAyahAudio: (surahNumber: number, ayahNumber: number) => void
  setActiveTab: (tab: string) => void
}

export function VerseComponent({
  verse,
  surahNumber,
  theme,
  isCurrentVerse,
  isActiveVerse,
  translation,
  tafsirText,
  tafsirLoading,
  tafsirError,
  activeTab,
  handleVerseClick,
  playAyahAudio,
  setActiveTab,
}: VerseComponentProps) {
  const verseNumber = verse.numberInSurah
  const verseKey = `${surahNumber}:${verseNumber}`

  return (
    <div
      key={verseKey}
      className={`rounded-lg p-4 transition-all duration-300 animate-fade-in ${
        isActiveVerse
          ? theme === "dark"
            ? "bg-green-900/20 border border-green-800"
            : "bg-green-50 border border-green-200"
          : isCurrentVerse
            ? theme === "dark"
              ? "bg-blue-900/20 border border-blue-800 animate-pulse-subtle"
              : "bg-blue-50 border border-blue-200 animate-pulse-subtle"
            : theme === "dark"
              ? "hover:bg-gray-800 border border-transparent"
              : "hover:bg-gray-50 border border-transparent"
      }`}
      onClick={() => handleVerseClick(surahNumber, verseNumber)}
    >
      <div className="mb-2 flex items-center justify-between">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
            theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-200 text-gray-700"
          }`}
        >
          {verseNumber}
        </div>
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-full ${
              isCurrentVerse
                ? theme === "dark"
                  ? "bg-green-600 text-white"
                  : "bg-green-600 text-white"
                : theme === "dark"
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={(e) => {
              e.stopPropagation()
              playAyahAudio(surahNumber, verseNumber)
            }}
          >
            {isCurrentVerse ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>
      </div>
      <div
        dir="rtl"
        className={`mb-4 font-amiri text-2xl leading-loose ${
          isCurrentVerse ? "text-green-500 dark:text-green-400" : ""
        }`}
      >
        {verse.text}
      </div>
      <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>{translation}</div>

      {isActiveVerse && (
        <TafsirPanel
          theme={theme}
          activeTab={activeTab}
          tafsirText={tafsirText}
          tafsirLoading={tafsirLoading}
          tafsirError={tafsirError}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  )
}