import type { LinkuAPI } from "@linku/api-contract"
import { apiClient } from "~/shared/api"

export const AuthService = {
  async login(
    credentials: LinkuAPI.Login["RequestBody"]
  ): Promise<LinkuAPI.User> {
    return apiClient
      .post<LinkuAPI.User>("/users/login", credentials)
      .then(({ data }) => data)
  },

  async register(
    newUser: LinkuAPI.RegisterUser["RequestBody"]
  ): Promise<LinkuAPI.User> {
    return apiClient
      .post<LinkuAPI.User>("/users", newUser)
      .then(({ data }) => data)
  },

  async logout(): Promise<void> {
    await apiClient.post("/users/logout")
  },

  async getMe(): Promise<LinkuAPI.User | null> {
    return apiClient
      .get<LinkuAPI.User>("/users/me")
      .then(({ data }) => data)
      .catch(() => null)
  },
}
