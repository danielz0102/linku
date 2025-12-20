import type User from "~/domain/entities/user.js"

export type RegisterUserResponse =
  | {
      id: string
      username: string
      email: string
      profilePicUrl?: string
      status: "online" | "offline"
    }
  | { message: string }

export const RegisterUserResponseMapper = {
  fromEntity(user: User): RegisterUserResponse {
    return {
      id: user.id,
      username: user.username,
      email: user.email.value,
      profilePicUrl: user.profilePicUrl,
      status: user.status,
    }
  },
}
