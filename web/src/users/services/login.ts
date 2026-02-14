import { apiClient } from "~/shared/api"
import type { LoginBody, PublicUser as User } from "api-contract"

export async function login(credentials: LoginBody): Promise<User> {
  const { data } = await apiClient.post<User>("/users/login", credentials)

  return data
}
