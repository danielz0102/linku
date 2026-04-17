import { users } from "#db/drizzle/schemas.ts"

import type { User } from "../domain/user.ts"

export type UserModel = typeof users.$inferSelect

export function toDomain(model: UserModel): User {
  const { hashedPassword: _, ...rest } = model
  return rest
}
