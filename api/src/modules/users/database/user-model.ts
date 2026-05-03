import { users } from "#db/drizzle/schemas.ts"

import type { UserData } from "../dtos/user-data.ts"

export type UserModel = typeof users.$inferSelect

export function toPublicData(model: UserModel): UserData {
  const { hashedPassword: _, ...rest } = model
  return rest
}
