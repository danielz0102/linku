import type { User } from "#core/users/user.js"

export type PublicUser = {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  profilePicUrl: string | null
  bio: string | null
}

export function toPublicUser(user: User): PublicUser {
  const { hashedPassword: _, ...rest } = user.toPrimitives()
  return rest
}
