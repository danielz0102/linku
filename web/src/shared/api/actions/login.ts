import { API_URL } from "~/env"

export async function login(data: { username: string; password: string }): Promise<boolean> {
  const res = await fetch(`${API_URL}/session`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    if (res.status === 401) {
      return false
    }

    throw new Error("Failed to login")
  }

  return true
}
