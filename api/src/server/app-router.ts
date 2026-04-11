import { publicProcedure, router } from "#shared/trpc.ts"

import { auth } from "./routers/auth-router.ts"

export const appRouter = router({
  sayHi: publicProcedure.query(async () => {
    return "Hello, world!"
  }),
  auth,
})

export type AppRouter = typeof appRouter
