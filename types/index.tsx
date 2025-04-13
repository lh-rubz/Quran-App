export interface Surah {
  number: number
  name: string
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
  page?: number
}

export interface Page {
  number: number
  name: string
}

export interface Edition {
  identifier: string
  language: string
  name: string
  englishName: string
  format: string
  type: string
  direction?: string
}

export interface Reciter {
  identifier: string
  language: string
  name: string
  englishName: string
  format: string
  type: string
}

export interface Verse {
  number: number
  text: string
  numberInSurah: number
  juz: number
  page: number
  translation?: string
  audioUrl?: string
  surah: {
    number: number
    name: string
    englishName: string
    englishNameTranslation?: string
  }
}

export interface Tafsir {
  verseId: number
  text: string
  surahNumber?: number
}

export interface AyahTiming {
  ayah: number
  polygon: string | null
  start_time: number
  end_time: number
  x: string | null
  y: string | null
  page: string | null
}

export interface Tadabor {
  verseId: number
  text: string
  surahNumber?: number
}
