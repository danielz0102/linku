import type { User } from "#users/domain/user.js"

import type { PublicUser } from "./public-user.js"

export function toPublicUser(user: User): PublicUser {
  const { hashedPassword: _, ...rest } = user.toPrimitives()
  return rest
}
