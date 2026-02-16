import { apiClient } from "~/shared/api"

export async function logout(): Promise<void> {
  await apiClient.post("/users/logout")
}
