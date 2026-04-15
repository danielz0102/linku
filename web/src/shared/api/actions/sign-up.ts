import { API_URL } from "~/env"

export async function signUp(data: {
  firstName: string
  lastName: string
  username: string
  password: string
}): Promise<boolean> {
  const res = await fetch(`${API_URL}/users`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    if (res.status === 409) {
      return false
    }

    throw new Error("Failed to create user")
  }

  return true
}
