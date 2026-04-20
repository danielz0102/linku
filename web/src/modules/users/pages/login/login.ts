import { API_URL } from "~/env"

import { UserEntity } from "../../domain/user-entity"

export async function login(data: {
  username: string
  password: string
}): Promise<UserEntity | undefined> {
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

  const userData = await res.json()
  return new UserEntity(userData)
}
