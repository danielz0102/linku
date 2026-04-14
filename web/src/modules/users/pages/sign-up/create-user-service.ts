import { API_URL } from "~/env"

type CreateUserCommand = {
  firstName: string
  lastName: string
  username: string
  password: string
}

export async function createUser(cmd: CreateUserCommand): Promise<boolean> {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  })

  if (!res.ok) {
    if (res.status === 409) {
      return false
    }

    throw new Error("Failed to create user")
  }

  return true
}
