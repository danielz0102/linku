import type { LinkuAPI } from "@linku/api-contract"
import { createContext, use } from "react"

type AuthContextValue = {
  user: LinkuAPI.User | null
  login(credentials: LinkuAPI.Login["RequestBody"]): Promise<void>
  register(newUser: LinkuAPI.RegisterUser["RequestBody"]): Promise<void>
  refresh(): Promise<void>
  logout(): Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const value = use(AuthContext)

  if (!value) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return value
}

export function useUser() {
  const { user } = useAuth()

  if (!user) {
    throw new Error("User is not authenticated")
  }

  return user
}
