import { API_URL } from "~/env"

import type { User } from "../../domain/user"

type UpdateUserPayload = {
  firstName: string
  lastName: string
  username: string
  profilePictureUrl: string | null
  bio: string | null
}

export async function updateUser(data: UpdateUserPayload): Promise<User | undefined> {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    if (res.status === 409) {
      return
    }

    throw new Error("Failed to update user")
  }

  return res.json()
}
