import { apiClient } from "~/api"
import type { NewUser, User } from "~/types"

export async function register(newUser: NewUser): Promise<User> {
  const { data } = await apiClient.post<User>("/users", newUser)
  return data
}
