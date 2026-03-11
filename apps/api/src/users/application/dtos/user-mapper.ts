import type { User } from "#users/domain/user.js"
import type { PrivateUser } from "./private-user.js"

export function toPrivateUser(user: User): PrivateUser {
  const { hashedPassword: _, ...rest } = user.toPrimitives()
  return rest
}
