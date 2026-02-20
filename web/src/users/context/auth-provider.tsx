import type { LoginBody, RegistrationBody as NewUser } from "api-contract"
import { use, useState } from "react"
import { AuthService } from "~/users/services/auth-service"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [currentUser, setCurrentUser] = useState(() => AuthService.getMe())
  const user = use(currentUser)

  async function login(credentials: LoginBody): Promise<void> {
    const nextUser = AuthService.login(credentials)
    setCurrentUser(nextUser)
  }

  async function register(newUser: NewUser): Promise<void> {
    const nextUser = AuthService.register(newUser)
    setCurrentUser(nextUser)
  }

  async function logout(): Promise<void> {
    await AuthService.logout()
    setCurrentUser(Promise.resolve(null))
  }

  return (
    <AuthContext value={{ user, login, register, logout }}>
      {children}
    </AuthContext>
  )
}
