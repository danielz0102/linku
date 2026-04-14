import { API_URL } from "~/env"

export async function logOut() {
  await fetch(`${API_URL}/session`, {
    method: "DELETE",
    credentials: "include",
  })
}
