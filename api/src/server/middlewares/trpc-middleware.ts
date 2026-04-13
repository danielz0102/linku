import * as trpcExpress from "@trpc/server/adapters/express"

import { appRouter } from "#server/app-router.ts"
import { createContext } from "#shared/trpc.ts"

export const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
})
