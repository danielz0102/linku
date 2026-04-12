import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { users } from "#db/drizzle/schemas.ts"
import { publicProcedure } from "#shared/trpc.ts"

export const whoamiProcedure = publicProcedure.query(async ({ ctx }) => {
  const id = ctx.req.session.userId

  if (!id) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "User is not authenticated" })
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
    .then((res) => res[0]!)

  return {
    id: user.id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePictureUrl: user.profilePictureUrl,
    bio: user.bio,
  }
})
