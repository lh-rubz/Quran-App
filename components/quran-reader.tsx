"use client"

import { useState, useEffect, useRef } from "react"
import type { Reciter } from "@/types"
import { useTheme } from "@/components/theme-provider"
import { useTafsirText } from "@/hooks/use-tafsir-text"
import { VerseComponent } from "./verse-component"
import { AudioControls } from "./audio-controls"
import { HeaderSection } from "./header"

interface QuranReaderProps {
  selectedSurah: number
  selectedPage: number
  selectedEdition: string
  selectedTranslation: string
  selectedReciter: string
  selectedTafsir: string
  reciters: Reciter[]
  toggleSidebar: () => void
  isMobile: boolean
  viewMode: "surah" | "page"
  setSelectedPage: (page: number) => void
  searchResults?: { [key: string]: { surah: number; ayah: number; text: string } }[];
}

export function QuranReader({
  selectedSurah,
  selectedPage,
  selectedEdition,
  selectedTranslation,
  selectedReciter,
  selectedTafsir,
  reciters,
  toggleSidebar,
  isMobile,
  viewMode,
  setSelectedPage,
}: QuranReaderProps) {
  const [surahData, setSurahData] = useState<{ ayahs: Verse[]; numberOfAyahs: number; number: number } | null>(null)
  const [pageData, setPageData] = useState<{ ayahs: Verse[] } | null>(null)
  const [translationData, setTranslationData] = useState<{ ayahs: Verse[] } | null>(null)
  const [activeVerse, setActiveVerse] = useState<string | null>(null)
  const [activeVerseNumber, setActiveVerseNumber] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<string>("tafsir")
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentAyah, setCurrentAyah] = useState<number | null>(null)
  const [currentSurah, setCurrentSurah] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const verseRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { theme } = useTheme()

  const {
    tafsirText,
    loading: tafsirLoading,
    error: tafsirError,
  } = useTafsirText(activeVerseNumber ? activeVerseNumber : 0, selectedTafsir)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (viewMode === "surah") {
          const [arabicRes, translationRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/${selectedEdition}`),
            fetch(`https://api.alquran.cloud/v1/surah/${selectedSurah}/${selectedTranslation}`),
          ])

          const [arabicData, translationData] = await Promise.all([
            arabicRes.json(),
            translationRes.json(),
          ])

          setSurahData(arabicData.data)
          setTranslationData(translationData.data)
          setPageData(null)
        } else {
          const [arabicRes, translationRes] = await Promise.all([
            fetch(`https://api.alquran.cloud/v1/page/${selectedPage}/${selectedEdition}`),
            fetch(`https://api.alquran.cloud/v1/page/${selectedPage}/${selectedTranslation}`),
          ])

          const [arabicData, translationData] = await Promise.all([
            arabicRes.json(),
            translationRes.json(),
          ])

          setPageData(arabicData.data)
          setTranslationData(translationData.data)
          setSurahData(null)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    setActiveVerse(null)
    setActiveVerseNumber(null)
    setCurrentAyah(null)
    setCurrentSurah(null)
    setIsPlaying(false)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }
    }
  }, [selectedSurah, selectedPage, selectedEdition, selectedTranslation, viewMode])

  const handleVerseClick = async (surahNumber: number, verseNumber: number) => {
    const verseKey = `${surahNumber}:${verseNumber}`

    if (activeVerse === verseKey) {
      setActiveVerse(null)
      setActiveVerseNumber(null)
      return
    }

    setActiveVerse(verseKey)
    setActiveTab("tafsir")

    let globalAyahNumber = 0

    if (viewMode === "surah" && surahData) {
      const ayah = surahData.ayahs.find((a: { numberInSurah: number }) => a.numberInSurah === verseNumber)
      globalAyahNumber = ayah?.numberInSurah || 0
    } else if (viewMode === "page" && pageData) {
      const ayah = pageData.ayahs.find(
        (a: { surah: { number: number }; numberInSurah: number }) =>
          a.surah.number === surahNumber && a.numberInSurah === verseNumber,
      )
      globalAyahNumber = ayah?.numberInSurah || 0
    }

    if (globalAyahNumber > 0) {
      setActiveVerseNumber(globalAyahNumber)
    }
  }

  const playAyahAudio = async (surahNumber: number, ayahNumber: number) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
      }

      const reciter = reciters.find((r) => r.identifier === selectedReciter)
      if (!reciter) return

      const ayahResponse = await fetch(
        `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${reciter.identifier || "ar.alafasy"}`,
      )
      const ayahData = await ayahResponse.json()

      if (ayahData.data?.audio) {
        const audio = new Audio(ayahData.data.audio)
        audioRef.current = audio

        audio.addEventListener("ended", () => handleAyahEnded(surahNumber, ayahNumber))
        audio.addEventListener("play", () => {
          setIsPlaying(true)
          setCurrentAyah(ayahNumber)
          setCurrentSurah(surahNumber)
        })
        audio.addEventListener("pause", () => {
          if (!audio.ended) setIsPlaying(false)
        })

        audio.play()
      }
    } catch (error) {
      console.error("Error playing ayah audio:", error)
    }
  }

  const handleAyahEnded = (surahNumber: number, ayahNumber: number) => {
    moveToNextAyah(surahNumber, ayahNumber)
  }

  const moveToNextAyah = (surahNumber: number, ayahNumber: number) => {
    if (viewMode === "surah" && surahData) {
      const nextAyah = ayahNumber + 1
      if (nextAyah <= surahData.numberOfAyahs) {
        playAyahAudio(surahNumber, nextAyah)
      } else {
        stopAllAudio()
      }
    } else if (viewMode === "page" && pageData) {
      const currentAyahIndex = pageData.ayahs.findIndex(
        (a: { surah: { number: number }; numberInSurah: number }) =>
          a.surah.number === surahNumber && a.numberInSurah === ayahNumber,
      )

      if (currentAyahIndex < pageData.ayahs.length - 1) {
        const nextAyahData = pageData.ayahs[currentAyahIndex + 1]
        playAyahAudio(nextAyahData.surah.number, nextAyahData.numberInSurah)
      } else if (selectedPage < 604) {
        setSelectedPage(selectedPage + 1)
      } else {
        stopAllAudio()
      }
    }
  }

  const stopAllAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
    setIsPlaying(false)
    setCurrentAyah(null)
    setCurrentSurah(null)
  }

  useEffect(() => {
    if (currentSurah && currentAyah) {
      const verseKey = `${currentSurah}:${currentAyah}`
      if (verseRefs.current[verseKey]) {
        verseRefs.current[verseKey]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentSurah, currentAyah])

  const handlePreviousNavigation = () => {
    if (selectedPage > 1) {
      setSelectedPage(selectedPage - 1)
    }
  }

  const handleNextNavigation = () => {
    if (selectedPage < 604) {
      setSelectedPage(selectedPage + 1)
    }
  }

  const renderVerses = (verses: Verse[]) => {if (viewMode === "page") {
      const versesGroupedBySurah: { [key: number]: Verse[] } = {}

      verses.forEach((verse) => {
        const surahNumber = verse.surah.number
        if (!versesGroupedBySurah[surahNumber]) {
          versesGroupedBySurah[surahNumber] = []
        }
        versesGroupedBySurah[surahNumber].push(verse)
      })

      return Object.entries(versesGroupedBySurah).map(([surahNumber, surahVerses], surahIndex) => (
        <div key={surahNumber} className="mb-6">
          {surahIndex > 0 && (
            <div className={`my-4 border-t ${theme === "dark" ? "border-gray-700" : "border-gray-300"}`}></div>
          )}
          <div className="mb-2 font-bold">
            {surahVerses[0].surah.englishName} ({surahVerses[0].surah.name})
          </div>
          {surahVerses.map((verse) => renderVerse(verse, Number.parseInt(surahNumber)))}
        </div>
      ))
    }

    return verses.map((verse) => renderVerse(verse, viewMode === "surah" ? selectedSurah : verse.surah.number))
  }

  interface Verse {
    numberInSurah: number;
    surah: { number: number; name: string; englishName: string };
    text: string;
  }

  const renderVerse = (verse: Verse, surahNumber: number) => {
    const verseNumber = verse.numberInSurah
    const verseKey = `${surahNumber}:${verseNumber}`
    const isCurrentVerse = currentSurah === surahNumber && currentAyah === verseNumber
    const isActiveVerse = activeVerse === verseKey

    let translation = ""
    if (viewMode === "surah" && translationData && translationData.ayahs) {
      translation = translationData.ayahs[verseNumber - 1]?.text || ""
    } else if (viewMode === "page" && translationData && translationData.ayahs) {
      const translationVerse = translationData.ayahs.find(
        (a: Verse) => a.surah.number === surahNumber && a.numberInSurah === verseNumber,
      )
      translation = translationVerse?.text || ""
    }

    return (
      <VerseComponent
        key={verseKey}
        verse={verse}
        surahNumber={surahNumber}
        theme={theme}
        isCurrentVerse={isCurrentVerse}
        isActiveVerse={isActiveVerse}
        translation={translation}
        tafsirText={tafsirText}
        tafsirLoading={tafsirLoading}
        tafsirError={!!tafsirError}
        activeTab={activeTab}
        currentSurah={currentSurah}
        currentAyah={currentAyah}
        handleVerseClick={handleVerseClick}
        playAyahAudio={playAyahAudio}
        setActiveTab={setActiveTab}
      />
    )
  }

  const renderContent = () => {
    if (viewMode === "surah" && surahData) {
      return (
        <>
          <HeaderSection
            theme={theme}
            isMobile={isMobile}
            viewMode={viewMode}
            selectedPage={selectedPage}
            surahData={surahData}
            toggleSidebar={toggleSidebar}
            handlePreviousNavigation={handlePreviousNavigation}
            handleNextNavigation={handleNextNavigation}
          />

          <div className="flex-1 overflow-auto custom-scrollbar p-4">
            <div className="mx-auto max-w-3xl">
              {surahData.number !== 9 && (
                <div className="mb-6 text-center font-amiri text-3xl animate-fade-in">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}

              <div className="grid gap-6">{renderVerses(surahData.ayahs)}</div>
            </div>
          </div>
        </>
      )
    } else if (viewMode === "page" && pageData) {
      return (
        <>
          <HeaderSection
            theme={theme}
            isMobile={isMobile}
            viewMode={viewMode}
            selectedPage={selectedPage}
            surahData={{}}
            toggleSidebar={toggleSidebar}
            handlePreviousNavigation={handlePreviousNavigation}
            handleNextNavigation={handleNextNavigation}
          />

          <div className="flex-1 overflow-auto custom-scrollbar p-4">
            <div className="mx-auto max-w-3xl">
              <div className="grid gap-6">{renderVerses(pageData.ayahs)}</div>
            </div>
          </div>
        </>
      )
    } else {
      return (
        <div className="flex h-full items-center justify-center">
          <p>Failed to load Quran data. Please try again.</p>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="flex h-full flex-col p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className={`h-8 w-40 rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}></div>
         
        </div>
        <div className="grid gap-4">
          {Array(10)
            .fill(null)
            .map((_, i) => (
              <div key={i} className="grid gap-2">
                <div
                  className={`h-8 w-full rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                ></div>
                <div
                  className={`h-4 w-full rounded ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"} animate-pulse`}
                ></div>
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {renderContent()}

      <AudioControls
        theme={theme}
        isPlaying={isPlaying}
        currentSurah={currentSurah}
        currentAyah={currentAyah}
        stopAllAudio={stopAllAudio}
      />

      <audio ref={audioRef} className="hidden" />
    </div>
  )
}