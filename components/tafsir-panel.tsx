"use client"

import { BookOpen } from "lucide-react"

interface TafsirPanelProps {
  theme: string
  activeTab: string
  tafsirText: string | null
  tafsirLoading: boolean
  tafsirError: boolean
  setActiveTab: (tab: string) => void
}

export function TafsirPanel({
  theme,
  activeTab,
  tafsirText,
  tafsirLoading,
  tafsirError,
  setActiveTab,
}: TafsirPanelProps) {
  return (
    <div
      className={`mt-4 rounded-lg border p-4 animate-slide-down ${
        theme === "dark" ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        <button
          className={`flex-1 py-2 px-4 text-center font-medium transition-colors duration-200 ${
            activeTab === "tafsir"
              ? theme === "dark"
                ? "border-b-2 border-green-500 text-green-500"
                : "border-b-2 border-green-600 text-green-600"
              : ""
          }`}
          onClick={() => setActiveTab("tafsir")}
        >
          <div className="flex items-center justify-center">
            <BookOpen className="mr-2 h-4 w-4" />
            تفسير
          </div>
        </button>
      </div>

      {activeTab === "tafsir" && (
        <div dir="rtl" className="font-noto-arabic">
          {tafsirLoading
            ? "جاري تحميل التفسير..."
            : tafsirError
              ? "حدث خطأ أثناء تحميل التفسير"
              : tafsirText
                ? tafsirText
                : "التفسير غير متوفر لهذه الآية"}
        </div>
      )}
    </div>
  )
}