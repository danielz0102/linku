import { API_URL } from "~/env"

import type { UserResponse } from "../user-response"

export async function getUser(username: string): Promise<UserResponse> {
  const res = await fetch(`${API_URL}/users/${username}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user", { cause: res })
  }

  return res.json()
}
