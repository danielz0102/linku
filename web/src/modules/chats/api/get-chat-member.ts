import { API_URL } from "~/env"

import type { ChatMemberData } from "../domain/chat-member"

type APIResponse = {
  id: string
  username: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
  bio: string | null
}

export async function getChatMember(username: string): Promise<ChatMemberData | null> {
  const res = await fetch(`${API_URL}/users/${username}`, { credentials: "include" })

  if (!res.ok) {
    if (res.status === 404) {
      return null
    }

    throw new Error("Failed to fetch chat member", { cause: res })
  }

  const data = (await res.json()) as APIResponse

  return {
    id: data.id,
    username: data.username,
    name: `${data.firstName} ${data.lastName}`,
    profilePicURL: data.profilePictureUrl,
  }
}
