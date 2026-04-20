import { API_URL } from "~/env"

import { type UserData, UserEntity } from "../../domain/user-entity"

export async function searchUsers({
  query,
  page,
  limit,
}: {
  query: string
  page?: number
  limit?: number
}): Promise<UserEntity[]> {
  const params = new URLSearchParams({ query })

  if (page) {
    params.append("page", page.toString())
  }

  if (limit) {
    params.append("limit", limit.toString())
  }

  const response = await fetch(`${API_URL}/users?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to search users", { cause: response })
  }

  const data = (await response.json()) as UserData[]
  return data.map((d) => new UserEntity(d))
}
