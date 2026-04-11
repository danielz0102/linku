import { auth } from "#modules/users/auth-router.ts"
import { publicProcedure, router } from "#shared/trpc.ts"

export const appRouter = router({
  sayHi: publicProcedure.query(async () => {
    return "Hello, world!"
  }),
  auth,
})

export type AppRouter = typeof appRouter
