import { API_URL } from "~/env"

import { UserEntity } from "../domain/user-entity"

export async function whoami(): Promise<UserEntity | undefined> {
  const response = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  })

  if (response.status !== 200) {
    return undefined
  }

  const data = await response.json()
  return new UserEntity(data)
}
