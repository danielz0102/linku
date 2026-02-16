import type { PublicUser as User } from "api-contract"
import { apiClient } from "~/shared/api"
import type { ApiError } from "~/shared/api/api-error"

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<User>("/users/me")
    return data
  } catch (error) {
    const apiError = error as ApiError

    if (apiError.code === "UNAUTHORIZED" || apiError.code === "NETWORK_ERROR") {
      return null
    }

    throw error
  }
}
