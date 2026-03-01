import type { LinkuAPI } from "@linku/api-contract"
import { apiClient } from "~/shared/api"

export async function updateUser(
  userData: LinkuAPI.UpdateUser["RequestBody"]
): Promise<LinkuAPI.User> {
  return apiClient
    .patch<LinkuAPI.User>("/users", userData)
    .then(({ data }) => data)
}
