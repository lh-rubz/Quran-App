import type React from "react"
import type { Metadata } from "next"
import { Amiri, Noto_Sans_Arabic, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
})

const notoSansArabic = Noto_Sans_Arabic({
  weight: ["400", "500", "700"],
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
})

export const metadata: Metadata = {
  title: "Quran App",
  description: "Read, listen, and reflect on the Holy Quran",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amiri.variable} ${notoSansArabic.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
