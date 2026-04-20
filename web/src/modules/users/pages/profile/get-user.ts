import { API_URL } from "~/env"

import type { User } from "../../domain/user"

export async function getUser(username: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${username}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user", { cause: res })
  }

  return res.json()
}
