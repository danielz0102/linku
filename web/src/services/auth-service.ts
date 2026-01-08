import apiClient from "./api-client"

export const AuthService = {
  auth(token: string) {
    return apiClient.post<{ accessToken: string }>("/auth/google", undefined, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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
