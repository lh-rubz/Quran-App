"use client"

import { useState, useEffect, useRef } from "react"
import type { Surah, Edition, Reciter, Page, Tafsir } from "@/types"
import { useTheme } from "@/components/theme-provider"
import { Book, Search, Menu, Moon, Sun, X, FileText, Settings, Headphones, BookOpen } from "lucide-react"

interface SidebarProps {
  surahs: Surah[]
  pages: Page[]
  selectedSurah: number
  setSelectedSurah: (surah: number) => void
  selectedPage: number
  setSelectedPage: (page: number) => void
  editions: Edition[]
  selectedEdition: string
  setSelectedEdition: (edition: string) => void
  selectedTranslation: string
  setSelectedTranslation: (translation: string) => void
  reciters: Reciter[]
  selectedReciter: string
  setSelectedReciter: (reciter: string) => void
  tafsirs: Tafsir[]
  selectedTafsir: string
  setSelectedTafsir: (tafsir: string) => void
  isOpen: boolean
  toggleSidebar: () => void
  isMobile: boolean
  viewMode: "surah" | "page"
  setViewMode: (mode: "surah" | "page") => void
  searchQuery: string
  handleSearch: (query: string) => void

}

export function Sidebar({
  surahs,
  pages,
  selectedSurah,
  setSelectedSurah,
  selectedPage,
  setSelectedPage,
  editions,
  selectedEdition,
  setSelectedEdition,
  selectedTranslation,
  setSelectedTranslation,
  reciters,
  selectedReciter,
  setSelectedReciter,
  tafsirs,
  selectedTafsir,
  setSelectedTafsir,
  isOpen,
  toggleSidebar,
  isMobile,
  viewMode,
  setViewMode,
  searchQuery,
  handleSearch,
 


}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<"surahs" | "pages" | "search" | "settings">("surahs")
  const [surahSearchQuery, setSurahSearchQuery] = useState("")
  const [pageSearchQuery, setPageSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.name.toLowerCase().includes(surahSearchQuery.toLowerCase()) ||
      surah.englishName.toLowerCase().includes(surahSearchQuery.toLowerCase()) ||
      surah.englishNameTranslation.toLowerCase().includes(surahSearchQuery.toLowerCase()),
  )

  const filteredPages = pages.filter((page) => page.name.toLowerCase().includes(pageSearchQuery.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleSidebar()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, isOpen, toggleSidebar])

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(searchQuery)
      }, 500)
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, handleSearch])

  const sidebarContent = (
    <div
      ref={sidebarRef}
      className={`flex h-full flex-col ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } transition-colors duration-300`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold">Quran App</h2>
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-full ${
              theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {isMobile && (
            <button
              className={`p-2 rounded-full ${
                theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
              }`}
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button
          className={`flex-1 py-3 px-2 text-center font-medium transition-colors duration-200 ${
            activeTab === "surahs"
              ? theme === "dark"
                ? "border-b-2 border-green-500 text-green-500"
                : "border-b-2 border-green-600 text-green-600"
              : ""
          }`}
          onClick={() => setActiveTab("surahs")}
        >
          <div className="flex items-center justify-center">
            <Book className="mr-1 h-4 w-4" />
            <span className="text-sm">Surahs</span>
          </div>
        </button>
        <button
          className={`flex-1 py-3 px-2 text-center font-medium transition-colors duration-200 ${
            activeTab === "pages"
              ? theme === "dark"
                ? "border-b-2 border-green-500 text-green-500"
                : "border-b-2 border-green-600 text-green-600"
              : ""
          }`}
          onClick={() => setActiveTab("pages")}
        >
          <div className="flex items-center justify-center">
            <FileText className="mr-1 h-4 w-4" />
            <span className="text-sm">Pages</span>
          </div>
        </button>
   
        <button
          className={`flex-1 py-3 px-2 text-center font-medium transition-colors duration-200 ${
            activeTab === "settings"
              ? theme === "dark"
                ? "border-b-2 border-green-500 text-green-500"
                : "border-b-2 border-green-600 text-green-600"
              : ""
          }`}
          onClick={() => setActiveTab("settings")}
        >
          <div className="flex items-center justify-center">
            <Settings className="mr-1 h-4 w-4" />
            <span className="text-sm">Settings</span>
          </div>
        </button>
      </div>

      {activeTab === "surahs" && (
        <>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search surahs..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={surahSearchQuery}
                onChange={(e) => setSurahSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="grid gap-1 p-4 pt-0">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                    selectedSurah === surah.number && viewMode === "surah"
                      ? theme === "dark"
                        ? "bg-green-900/30 text-green-500"
                        : "bg-green-100 text-green-800"
                      : theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedSurah(surah.number)
                    setViewMode("surah")
                    if (isMobile) toggleSidebar()
                  }}
                >
                  <div className="flex w-full items-center">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        theme === "dark" ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    >
                      {surah.number}
                    </div>
                    <div className="ml-2 flex-1">
                      <div className="text-sm font-medium">{surah.englishName}</div>
                      <div className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                        {surah.englishNameTranslation}
                      </div>
                    </div>
                    <div className="text-right font-amiri text-lg">{surah.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === "pages" && (
        <>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Go to page..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
                value={pageSearchQuery}
                onChange={(e) => setPageSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar">
            <div className="grid grid-cols-4 gap-2 p-4 pt-0">
              {filteredPages.map((page) => (
                <button
                  key={page.number}
                  className={`text-center p-2 rounded-lg transition-all duration-200 ${
                    selectedPage === page.number && viewMode === "page"
                      ? theme === "dark"
                        ? "bg-green-900/30 text-green-500"
                        : "bg-green-100 text-green-800"
                      : theme === "dark"
                        ? "hover:bg-gray-800"
                        : "hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    setSelectedPage(page.number)
                    setViewMode("page")
                    if (isMobile) toggleSidebar()
                  }}
                >
                  <div className="text-sm">{page.number}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

   

      {activeTab === "settings" && (
        <div className="flex-1 overflow-auto custom-scrollbar">
          <div className="grid gap-6 p-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">View Mode</label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${
                    viewMode === "surah"
                      ? theme === "dark"
                        ? "bg-green-900/30 border-green-800 text-green-500"
                        : "bg-green-100 border-green-200 text-green-800"
                      : theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-300"
                  }`}
                  onClick={() => setViewMode("surah")}
                >
                  <Book className="h-4 w-4" />
                  <span>Surah View</span>
                </button>
                <button
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${
                    viewMode === "page"
                      ? theme === "dark"
                        ? "bg-green-900/30 border-green-800 text-green-500"
                        : "bg-green-100 border-green-200 text-green-800"
                      : theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-300"
                  }`}
                  onClick={() => setViewMode("page")}
                >
                  <FileText className="h-4 w-4" />
                  <span>Page View</span>
                </button>
              </div>
            </div>
        
            <div className="grid gap-2">
              <label className="text-sm font-medium">Arabic Text</label>
              <select
                value={selectedEdition}
                onChange={(e) => setSelectedEdition(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                {editions
                  .filter((edition) => edition.format === "text" && edition.language === "ar" && edition.type==="quran")
                  .map((edition) => (
                    <option key={edition.identifier} value={edition.identifier}>
                      {edition.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Translation</label>
              <select
                value={selectedTranslation}
                onChange={(e) => setSelectedTranslation(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                {editions
                  .filter((edition) => edition.format === "text" && edition.language !== "ar")
                  .map((edition) => (
                    <option key={edition.identifier} value={edition.identifier}>
                      {edition.language} - {edition.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4" />
                <h2 className="text-sm font-medium">Tafsir (Commentary)</h2>
              </div>
              <select
                value={selectedTafsir}
                onChange={(e) => setSelectedTafsir(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                {tafsirs.map((tafsir) => (
                  <option key={tafsir.identifier} value={tafsir.identifier}>
                    {tafsir.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="h-4 w-4" />
                <h2 className="text-sm font-medium">Reciter</h2>
              </div>
              <select
                value={selectedReciter}
                onChange={(e) => setSelectedReciter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-green-500`}
              >
                {reciters.map((reciter) => (
                  <option key={reciter.identifier} value={reciter.identifier}>
                    {reciter.englishName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (isMobile) {
    return (
      <>
        <button
          className={`fixed left-4 top-4 z-50 p-2 rounded-full md:hidden ${
            theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900 shadow-md"
          }`}
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebarContent}
        </div>
      </>
    )
  }

  return <div className="hidden w-80 border-r border-gray-200 dark:border-gray-700 md:block">{sidebarContent}</div>
}
