import type { NewUser } from "~/db/drizzle/schema.ts"
import type { Result } from "~/lib/Result.ts"

export interface AuthService {
  verifyToken(token: string): Promise<Result<NewUser>>
}
