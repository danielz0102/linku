import apiClient from "./api-client"

export function auth(token: string) {
  return apiClient.post("/auth/google", undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
