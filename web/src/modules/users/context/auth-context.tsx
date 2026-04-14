import { createContext, use, useState, type PropsWithChildren } from "react"

import type { User } from "../domain/user"
import { getCurrentUser } from "../services/get-current-user"

type AuthContextValue =
  | {
      user: User | undefined
      refresh: () => Promise<void>
    }
  | undefined

const AuthContext = createContext<AuthContextValue>(undefined)
const currentUser = getCurrentUser()

export function AuthProvider({ children }: PropsWithChildren) {
  const [userPromise, setUserPromise] = useState(currentUser)
  const user = use(userPromise)

  const refresh = async () => {
    const newUserPromise = getCurrentUser()
    setUserPromise(newUserPromise)
  }

  return <AuthContext value={{ user, refresh }}>{children}</AuthContext>
}

export function useAuth() {
  const value = use(AuthContext)

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return value
}
