import { publicProcedure } from "#shared/trpc.ts"

export const logoutProcedure = publicProcedure.mutation(async ({ ctx }) => {
  if (!ctx.req.session.userId) return
  ctx.clearSession()
})
