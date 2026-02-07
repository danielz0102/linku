import type { NewUser, User } from "~/types"
import apiClient from "./api-client"

export async function register(newUser: NewUser): Promise<User> {
  const { data } = await apiClient.post<User>("/register", newUser)
  return data
}
