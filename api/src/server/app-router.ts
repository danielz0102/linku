import { publicProcedure, router } from "./trpc.ts"

export const appRouter = router({
  sayHi: publicProcedure.query(async () => {
    return "Hello, world!"
  }),
})

export type AppRouter = typeof appRouter
