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

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => missingAuthProvider(),
  register: () => missingAuthProvider(),
  logout: () => missingAuthProvider(),
})

export function useAuth() {
  return use(AuthContext)
}

function missingAuthProvider<T>(): Promise<T> {
  throw new Error("AuthProvider is required")
}
