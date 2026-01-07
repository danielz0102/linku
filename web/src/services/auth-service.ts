import apiClient from "./api-client"

export function auth(token: string) {
  return apiClient.post<{ accessToken: string }>("/auth/google", undefined, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getAccessToken() {
  try {
    const { data } = await apiClient.get<{ accessToken: string }>("/auth/me")
    return data.accessToken
  } catch {
    return null
  }
}
