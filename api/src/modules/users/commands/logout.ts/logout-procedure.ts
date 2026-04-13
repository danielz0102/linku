import { TRPCError } from "@trpc/server"

import { publicProcedure } from "#shared/trpc.ts"

export const logoutProcedure = publicProcedure.mutation(async ({ ctx }) => {
  if (!ctx.req.session.userId) return

  ctx.req.session.destroy((error) => {
    if (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
      })
    }

    ctx.res.clearCookie("connect.sid")
  })
})
