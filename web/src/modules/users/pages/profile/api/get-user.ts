import { API_URL } from "~/env"
import { User } from "~/modules/users/domain/user"

export async function getUser(username: string): Promise<User | null> {
  const res = await fetch(`${API_URL}/users/${username}`, {
    method: "GET",
    credentials: "include",
  })

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }

    throw new Error("Failed to fetch user", { cause: res })
  }

  const data = await res.json()
  return new User(data)
}
