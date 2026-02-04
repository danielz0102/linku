import { useEffect } from "react"

type UseScrollParams = {
  top: number
  on: boolean
}

export function useScroll({ on, top }: UseScrollParams) {
  useEffect(() => {
    if (on) {
      window.scrollTo({ top, behavior: "smooth" })
    }
  }, [on, top])
}
