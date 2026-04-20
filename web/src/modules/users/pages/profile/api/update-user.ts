import { API_URL } from "~/env"
import { UserEntity } from "~/modules/users/domain/user-entity"

type UpdateUserPayload = {
  firstName: string
  lastName: string
  username: string
  profilePictureUrl: string | null
  bio: string | null
}

export async function updateUser(payload: UpdateUserPayload): Promise<UserEntity | undefined> {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    if (res.status === 409) {
      return
    }

    throw new Error("Failed to update user")
  }

  const data = await res.json()
  return new UserEntity(data)
}
