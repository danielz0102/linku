import type { LinkuAPI } from "@linku/api-contract"
import { apiClient } from "~/shared/api"

export const AuthService = {
  async login(
    credentials: LinkuAPI.Login["RequestBody"]
  ): Promise<LinkuAPI.PublicUser> {
    return apiClient
      .post<LinkuAPI.PublicUser>("/users/login", credentials)
      .then(({ data }) => data)
  },

  async register(
    newUser: LinkuAPI.RegisterUser["RequestBody"]
  ): Promise<LinkuAPI.PublicUser> {
    return apiClient
      .post<LinkuAPI.PublicUser>("/users", newUser)
      .then(({ data }) => data)
  },

  async logout(): Promise<void> {
    await apiClient.post("/users/logout")
  },

  async getMe(): Promise<LinkuAPI.PublicUser | null> {
    return apiClient
      .get<LinkuAPI.PublicUser>("/users/me")
      .then(({ data }) => data)
      .catch(() => null)
  },
}
