import { createContext, use, useState, type PropsWithChildren } from "react"

import { API_URL } from "~/env"

import type { User } from "../domain/user"

type AuthContextValue =
  | {
      user: User | undefined
      refresh: () => Promise<void>
    }
  | undefined

const AuthContext = createContext<AuthContextValue>(undefined)

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | undefined>()

  const refresh = async () => {
    const response = await fetch(`${API_URL}/users/me`, {
      credentials: "include",
    })

    if (response.status !== 200) {
      return setUser(undefined)
    }

    const userData = await response.json()
    setUser(userData)
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
