import { useEffect, useRef } from "react"

export function useDebounce(delay: number) {
  const timeoutIdRef = useRef<number | null>(null)

  const debounce = (fn: () => void) => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }

    timeoutIdRef.current = setTimeout(() => {
      fn()
    }, delay)
  }

  useEffect(() => {
    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [])

  return debounce
}
