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

async function getCurrentUser(): Promise<User | undefined> {
  const response = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  })

  if (response.status !== 200) {
    return undefined
  }

  return response.json()
}
