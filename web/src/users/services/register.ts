import { apiClient } from "~/api"
import type {
  PublicUser as User,
  RegistrationBody as NewUser,
} from "api-contract"

export async function register(newUser: NewUser): Promise<User> {
  const { data } = await apiClient.post<User>("/users", newUser)
  return data
}
