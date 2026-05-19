import { API_URL } from "~/env"
import { Result } from "~/shared/result"

import { User } from "../../domain/user"
import type { LoginError } from "./login-types"

export async function login(data: {
  username: string
  password: string
}): Promise<Result<User, LoginError>> {
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
      return Result.fail("INVALID_CREDENTIALS")
    }

    if (res.status === 429) {
      return Result.fail("RATE_LIMITED")
    }

    throw new Error("Failed to login")
  }

  const userData = await res.json()
  return Result.ok(new User(userData))
}
