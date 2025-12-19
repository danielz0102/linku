import type User from "~/domain/entities/user.js"

export type RegisterUserResult = {
  id: string
  username: string
  email: string
  profilePicUrl?: string
  status: "online" | "offline"
}

export function toRegisterUserResult(user: User): RegisterUserResult {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePicUrl: user.profilePicUrl,
    status: user.status,
  }
}
