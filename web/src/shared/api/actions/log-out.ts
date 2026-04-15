import { API_URL } from "~/env"

export async function logOut(): Promise<void> {
  await fetch(`${API_URL}/session`, {
    credentials: "include",
    method: "DELETE",
  })
}
