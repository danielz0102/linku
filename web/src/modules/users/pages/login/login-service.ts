import { API_URL } from "~/env"

type LoginCommand = {
  username: string
  password: string
}

export async function login(cmd: LoginCommand): Promise<boolean> {
  const res = await fetch(`${API_URL}/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  })

  if (!res.ok) {
    if (res.status === 401) {
      return false
    }

    throw new Error("Failed to login")
  }

  return true
}
