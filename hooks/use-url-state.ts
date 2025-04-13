"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function useUrlState<T>(key: string, defaultValue: T) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [value, setValue] = useState<T>(() => {
    const param = searchParams.get(key)
    return param ? JSON.parse(param) : defaultValue
  })

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString())
    if (value !== defaultValue) {
      currentParams.set(key, JSON.stringify(value))
    } else {
      currentParams.delete(key)
    }
    router.replace(`${pathname}?${currentParams.toString()}`)
  }, [value, key, router, pathname, searchParams, defaultValue])

  return [value, setValue] as const
}
