import { API_URL } from "~/env"

import { User } from "../domain/user"

export async function whoami(): Promise<User | undefined> {
  const response = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  })

  if (response.status !== 200) {
    return undefined
  }

  const data = await response.json()
  return new User(data)
}
