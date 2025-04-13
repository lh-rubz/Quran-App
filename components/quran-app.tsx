"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar } from "@/components/sidebar"
import { QuranReader } from "@/components/quran-reader"
import { useTheme } from "@/components/theme-provider"
import { useUrlState } from "@/hooks/use-url-state"
import type { Edition, Page } from "@/types"
import { useSurah } from "@/hooks/use-surah"
import { useReciter } from "@/hooks/use-reciter"
import { useTafsir } from "@/hooks/use-tafsir"
import { useMobile } from "@/hooks/use-mobile"

export function QuranApp() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [selectedPage, setSelectedPage] = useUrlState<number>("page", 1)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { theme } = useTheme()
  const { surahs } = useSurah()
  const { reciters, selectedReciter, setSelectedReciter } = useReciter()
  const { tafsirs, selectedTafsir, setSelectedTafsir } = useTafsir()
  const [pages, setPages] = useState<Page[]>([])
  const [selectedSurah, setSelectedSurah] = useUrlState<number>("surah", 1)
  const [editions, setEditions] = useState<Edition[]>([])
  const [selectedEdition, setSelectedEdition] = useUrlState<string>("edition", "quran-uthmani")
  const [selectedTranslation, setSelectedTranslation] = useUrlState<string>("translation", "en.asad")
  const [loading, setLoading] = useState<boolean>(true)

  const [viewMode, setViewMode] = useUrlState<"surah" | "page">("view", "surah")
  const [searchResults, setSearchResults] = useState<any[]>([])
 
  const isMobile = useMobile()

  // Initialize pages
  useEffect(() => {
    // Create dummy pages for the UI
    const dummyPages = Array.from({ length: 604 }, (_, i) => ({
      number: i + 1,
      name: `Page ${i + 1}`,
    }))
    setPages(dummyPages)
  }, [])

  // Fetch editions
  useEffect(() => {
    const fetchEditions = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/edition/format/text")
        const data = await response.json()
        if (data.code === 200) {
          setEditions(data.data)
        }
      } catch (error) {
        console.error("Error fetching editions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEditions()
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev)
  }, [])

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      try {
        const response = await fetch(`https://api.alquran.cloud/v1/search/${query}/all/${selectedTranslation}`)
        const data = await response.json()

        if (data.code === 200) {
          setSearchResults(data.data.matches)
        } else {
          setSearchResults([])
        }
      } catch (error) {
        console.error("Error searching:", error)
        setSearchResults([])
      }
    },
    [selectedTranslation],
  )

  return (
    <div
      className={`flex h-screen flex-col ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} transition-colors duration-300`}
    >
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          surahs={surahs}
          pages={pages}
          selectedSurah={selectedSurah}
          setSelectedSurah={setSelectedSurah}
          selectedPage={selectedPage}
          setSelectedPage={setSelectedPage}
          editions={editions}
          selectedEdition={selectedEdition}
          setSelectedEdition={setSelectedEdition}
          selectedTranslation={selectedTranslation}
          setSelectedTranslation={setSelectedTranslation}
          reciters={reciters}
          selectedReciter={selectedReciter}
          setSelectedReciter={setSelectedReciter}
          tafsirs={tafsirs}
          selectedTafsir={selectedTafsir}
          setSelectedTafsir={setSelectedTafsir}
          isOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          viewMode={viewMode}
          setViewMode={setViewMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          searchResults={searchResults}
        />
        <main className="flex-1 overflow-auto">
          <QuranReader
            selectedSurah={selectedSurah}
            selectedPage={selectedPage}
            selectedEdition={selectedEdition}
            selectedTranslation={selectedTranslation}
            selectedReciter={selectedReciter}
            selectedTafsir={selectedTafsir}
            reciters={reciters}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
            viewMode={viewMode}
            searchResults={searchResults}
            setSelectedPage={setSelectedPage}
          />
        </main>
      </div>
    </div>
  )
}
