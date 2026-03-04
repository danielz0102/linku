import type { LinkuAPI } from "@linku/api-contract"
import { use, useState } from "react"
import { apiClient } from "~/shared/api"
import { AuthContext } from "./auth-context"

const initialUser = getMe()

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [currentUser, setUser] = useState(initialUser)
  const user = use(currentUser)

  const login = async (credentials: LinkuAPI.Login["RequestBody"]) => {
    const nextUser = await apiClient
      .post<LinkuAPI.User>("/users/login", credentials)
      .then(({ data }) => data)

    setUser(Promise.resolve(nextUser))
  }

  const register = async (newUser: LinkuAPI.RegisterUser["RequestBody"]) => {
    const nextUser = await apiClient
      .post<LinkuAPI.User>("/users", newUser)
      .then(({ data }) => data)

    setUser(Promise.resolve(nextUser))
  }

  const logout = async () => {
    await apiClient.post("/users/logout")
    setUser(Promise.resolve(null))
  }

  const refresh = async () => {
    const nextUser = await getMe()
    setUser(Promise.resolve(nextUser))
  }

  return (
    <AuthContext value={{ user, login, register, logout, refresh }}>
      {children}
    </AuthContext>
  )
}

async function getMe(): Promise<LinkuAPI.User | null> {
  return apiClient
    .get<LinkuAPI.User>("/users/me")
    .then(({ data }) => data)
    .catch(() => null)
}
