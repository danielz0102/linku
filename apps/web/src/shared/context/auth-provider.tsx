import type { LinkuAPI } from "@linku/api-contract"

import { use, useState } from "react"

import { apiClient } from "~/api"

import { AuthContext } from "./auth-context"

async function getMe(): Promise<LinkuAPI.User | null> {
  return apiClient
    .get<LinkuAPI.User>("/auth/me", {
      validateStatus: (status) => status === 200 || status === 401,
    })
    .then(({ data, status }) => (status === 401 ? null : data))
    .catch(() => null)
}

const initialUser = getMe()

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [currentUser, setUser] = useState(initialUser)
  const user = use(currentUser)

  const login = async (credentials: LinkuAPI.Login["RequestBody"]) => {
    const nextUser = await apiClient
      .post<LinkuAPI.User>("/auth/login", credentials)
      .then(({ data }) => data)

    setUser(Promise.resolve(nextUser))
  }

  const register = async (newUser: LinkuAPI.RegisterUser["RequestBody"]) => {
    const nextUser = await apiClient
      .post<LinkuAPI.User>("/auth/register", newUser)
      .then(({ data }) => data)

    setUser(Promise.resolve(nextUser))
  }

  const logout = async () => {
    await apiClient.post("/auth/logout")
    setUser(Promise.resolve(null))
  }

  const refresh = async () => {
    const nextUser = await getMe()
    setUser(Promise.resolve(nextUser))
  }

  return <AuthContext value={{ user, login, register, logout, refresh }}>{children}</AuthContext>
}
