import { API_URL } from "~/env"

import type { User } from "../domain/user"

export async function getCurrentUser(): Promise<User | undefined> {
  const response = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  })

  if (response.status !== 200) {
    return undefined
  }

  return response.json()
}
