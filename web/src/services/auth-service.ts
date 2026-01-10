import apiClient from "./api-client"

export const AuthService = {
  async auth(code: string) {
    const { data } = await apiClient.post<{ accessToken: string }>(
      "/auth/google",
      { code }
    )

    return data.accessToken
  },
  async getAccessToken() {
    try {
      const { data } = await apiClient.get<{ accessToken: string }>("/auth/me")
      return data.accessToken
    } catch {
      return null
    }
  },
  async logout() {
    await apiClient.get("/auth/logout")
  },
}
