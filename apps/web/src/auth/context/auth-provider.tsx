import type { LoginBody, RegistrationBody as NewUser } from "@linku/api-contract"
import { use, useState } from "react"
import { AuthService } from "~/auth/services/auth-service"
import { AuthContext } from "./auth-context"

const initialUser = AuthService.getMe()

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [currentUser, setUser] = useState(initialUser)
  const user = use(currentUser)

  const login = async (credentials: LoginBody) => {
    const nextUser = await AuthService.login(credentials)
    setUser(Promise.resolve(nextUser))
  }

  const register = async (newUser: NewUser) => {
    const nextUser = await AuthService.register(newUser)
    setUser(Promise.resolve(nextUser))
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
