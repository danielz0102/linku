import type {
  LoginBody,
  PublicUser as User,
  RegistrationBody as NewUser,
} from "api-contract"
import { createContext, use } from "react"

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: () => missingAuthProvider(),
  register: () => missingAuthProvider(),
  logout: () => missingAuthProvider(),
})

export function useAuth() {
  return use(AuthContext)
}

type AuthContextValue = {
  user: User | null
  login(credentials: LoginBody): Promise<User>
  register(newUser: NewUser): Promise<User>
  logout(): Promise<void>
}

async function missingAuthProvider() {
  throw new Error("AuthProvider is required")
}
