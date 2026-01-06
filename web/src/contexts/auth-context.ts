import { createContext } from "react"
import type { User } from "~/types"

export default createContext<{
  user?: User
  login: (tokenId: string) => Promise<void>
} | null>(null)
