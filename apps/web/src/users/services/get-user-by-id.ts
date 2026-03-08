import type { LinkuAPI } from "@linku/api-contract"
import { apiClient } from "~/shared/api"

export async function getUserById(id: string): Promise<LinkuAPI.User> {
  return apiClient
    .get<LinkuAPI.User>(`/users/${encodeURIComponent(id)}`)
    .then(({ data }) => data)
}
