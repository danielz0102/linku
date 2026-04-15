import { API_URL } from "~/env"

import type { UserResponse } from "../user-response"

export async function whoami(): Promise<UserResponse | undefined> {
  const response = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  })

  if (response.status !== 200) {
    return undefined
  }

  return response.json()
}
