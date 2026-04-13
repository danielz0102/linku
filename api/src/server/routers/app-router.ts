import { router } from "#shared/trpc.ts"

import { auth } from "./auth-router.ts"

export const appRouter = router({
  auth,
})

export type AppRouter = typeof appRouter
