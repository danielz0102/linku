import { API_URL } from "~/env"
import { UserEntity } from "~/modules/users/domain/user-entity"

export async function getUser(username: string): Promise<UserEntity> {
  const res = await fetch(`${API_URL}/users/${username}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user", { cause: res })
  }

  const data = await res.json()
  return new UserEntity(data)
}
