import type {
  LoginBody,
  PublicUser as User,
  RegistrationBody as NewUser,
} from "api-contract"
import { createContext, use } from "react"

type AuthContextValue = {
  user: User | null
  login(credentials: LoginBody): Promise<User>
  register(newUser: NewUser): Promise<User>
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
