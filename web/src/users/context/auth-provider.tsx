import type { LoginBody, RegistrationBody as NewUser } from "api-contract"
import { use, useState } from "react"
import { AuthService } from "~/users/services/auth-service"
import { AuthContext } from "./auth-context"

const initialUser = AuthService.getMe()

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [currentUser, setUser] = useState(initialUser)
  const user = use(currentUser)

  const login = async (credentials: LoginBody) => {
    const nextUser = AuthService.login(credentials)
    setUser(nextUser)
  }

  const register = async (newUser: NewUser) => {
    const nextUser = AuthService.register(newUser)
    setUser(nextUser)
  }

  const logout = async () => {
    await AuthService.logout()
    setUser(Promise.resolve(null))
  }

  return (
    <AuthContext value={{ user, login, register, logout }}>
      {children}
    </AuthContext>
  )
}
