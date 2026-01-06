import apiClient from "./api-client"

export function auth(token: string) {
  return apiClient.post<{ accessToken: string }>("/auth/google", undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
