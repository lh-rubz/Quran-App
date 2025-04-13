"use client"

import { ChevronLeft, ChevronRight, Menu } from "lucide-react"

interface HeaderSectionProps {
  theme: string
  isMobile: boolean
  viewMode: "surah" | "page"
  selectedPage: number
  surahData: any
  toggleSidebar: () => void
  handlePreviousNavigation: () => void
  handleNextNavigation: () => void
}

export function HeaderSection({
  theme,
  isMobile,
  viewMode,
  selectedPage,
  surahData,
  toggleSidebar,
  handlePreviousNavigation,
  handleNextNavigation,
}: HeaderSectionProps) {
  return (
    <div
      className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2">
        {isMobile && (
          <button
            className={`p-2 rounded-full ${
              theme === "dark" ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 text-gray-700"
            }`}
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-xl font-bold">
          {viewMode === "surah"
            ? `${surahData?.englishName} (${surahData?.name})`
            : `Page ${selectedPage}`}
        </h1>
      </div>

      {viewMode === "page" && (
        <div className="flex items-center gap-2">
          <button
            className={`p-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={handlePreviousNavigation}
            disabled={selectedPage <= 1}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-lg ${
              theme === "dark"
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
            onClick={handleNextNavigation}
            disabled={selectedPage >= 604}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}