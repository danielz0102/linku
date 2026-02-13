import { TriangleAlert } from "lucide-react"
import type { PropsWithChildren } from "react"

export function Alert({ children }: PropsWithChildren) {
  return (
    <p className="flex w-full items-center justify-center gap-1 rounded border border-red-900 bg-red-400 px-4 py-2 text-center text-sm text-red-950">
      <TriangleAlert strokeWidth={1.5} />
      {children}
    </p>
  )
}
