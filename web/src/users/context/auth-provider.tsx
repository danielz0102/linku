import type { LoginBody, PublicUser as User, RegistrationBody as NewUser } from "api-contract"
import { use, useState } from "react"
import { AuthContext } from "./auth-context"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState(() => getInitialUser())
  const user = use(currentUser)

  async function login(credentials: LoginBody): Promise<User> {
    const nextUser = await loginService(credentials)
    setCurrentUser(Promise.resolve(nextUser))
    return nextUser
  }

  async function register(newUser: NewUser): Promise<User> {
    const nextUser = await registerService(newUser)
    setCurrentUser(Promise.resolve(nextUser))
    return nextUser
  }

  async function logout(): Promise<void> {
    await logoutService()
    setCurrentUser(Promise.resolve(null))
  }

  return <AuthContext value={{ user, login, register, logout }}>{children}</AuthContext>
}

async function fetchMe() {
  const { getMe } = await import("../services/get-me")
  return getMe()
}

const initialUser = fetchMe()

function getInitialUser() {
  return initialUser
}

async function loginService(credentials: LoginBody) {
  const { login } = await import("../services/login")
  return login(credentials)
}

async function registerService(newUser: NewUser) {
  const { register } = await import("../services/register")
  return register(newUser)
}

async function logoutService() {
  const { logout } = await import("../services/logout")
  return logout()
}
