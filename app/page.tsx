import { QuranApp } from "@/components/quran-app"
import { Suspense } from "react"

export default function Home() {
  return <Suspense fallback={<div>Loading..</div>}><QuranApp /></Suspense>
}
