import type { JwtPayload } from "jsonwebtoken"
import type { User } from "./db/drizzle/schema.ts"

export type UserPayload = JwtPayload & User
export type RefreshTokenPayload = JwtPayload & { userId: string }
