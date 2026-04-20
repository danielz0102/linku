import { API_URL } from "~/env"

import type { User } from "../../domain/user"

export async function signUp(data: {
  firstName: string
  lastName: string
  username: string
  password: string
}): Promise<User | undefined> {
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
      return
    }

    throw new Error("Failed to create user")
  }

  return res.json()
}
