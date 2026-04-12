import bcrypt from "bcryptjs"
import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import type { Session, SessionData } from "express-session"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"

type LoginCommand = {
  username: string
  password: string
}

export async function login(
  cmd: LoginCommand,
  session: Session & Partial<SessionData>
): Promise<void> {
  const user = await db
    .select({ id: users.id, hashedPassword: users.hashedPassword })
    .from(users)
    .where(eq(users.username, cmd.username))
    .limit(1)
    .then((r) => r[0])

  if (!user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" })
  }

  const passwordMatches = await bcrypt.compare(cmd.password, user.hashedPassword)

  if (!passwordMatches) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" })
  }

  session.userId = user.id
}
