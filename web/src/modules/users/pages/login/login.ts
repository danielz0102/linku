import { API_URL } from "~/env"

import type { User } from "../../domain/user"

export async function login(data: {
  username: string
  password: string
}): Promise<User | undefined> {
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
      return
    }

    throw new Error("Failed to login")
  }

  return res.json()
}
