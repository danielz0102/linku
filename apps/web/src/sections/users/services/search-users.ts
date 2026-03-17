import type { LinkuAPI } from "@linku/api-contract"

import { apiClient } from "~/api"

export async function searchUsers(query: string): Promise<LinkuAPI.User[]> {
  return apiClient
    .get<LinkuAPI.User[]>("/users", {
      params: {
        username: query,
        firstName: query,
        lastName: query,
        limit: "8",
      },
    })
    .then(({ data }) => data)
}
