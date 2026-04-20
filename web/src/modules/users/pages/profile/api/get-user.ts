import { API_URL } from "~/env"
import { User } from "~/modules/users/domain/user"

export async function getUser(username: string): Promise<User> {
  const res = await fetch(`${API_URL}/users/${username}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch user", { cause: res })
  }

  const data = await res.json()
  return new User(data)
}
