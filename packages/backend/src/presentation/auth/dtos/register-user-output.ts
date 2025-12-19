import type User from "~/domain/entities/user.js"

export type RegisterUserOutput =
  | {
      id: string
      username: string
      email: string
      profilePicUrl?: string
      status: "online" | "offline"
    }
  | { message: string }

export function toRegisterUserOutput(user: User): RegisterUserOutput {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profilePicUrl: user.profilePicUrl,
    status: user.status,
  }
}
