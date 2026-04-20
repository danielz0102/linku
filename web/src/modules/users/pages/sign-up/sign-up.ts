import { API_URL } from "~/env"

import { UserEntity } from "../../domain/user-entity"

export async function signUp(data: {
  firstName: string
  lastName: string
  username: string
  password: string
}): Promise<UserEntity | undefined> {
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

  const userData = await res.json()
  return new UserEntity(userData)
}
