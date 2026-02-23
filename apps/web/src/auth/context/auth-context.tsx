import type {
  LoginBody,
  RegistrationBody as NewUser,
  PublicUser as User,
} from "@linku/api-contract"
import { createContext, use } from "react"

type AuthContextValue = {
  user: User | null
  login(credentials: LoginBody): Promise<void>
  register(newUser: NewUser): Promise<void>
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
