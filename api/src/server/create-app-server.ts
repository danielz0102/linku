import { createHTTPServer } from "@trpc/server/adapters/standalone"

import { createContext } from "../shared/trpc.ts"
import { appRouter } from "./app-router.ts"
import { corsMiddleware } from "./cors-middleware.ts"

export const createAppServer = () => {
  return createHTTPServer({
    router: appRouter,
    middleware: corsMiddleware,
    createContext,
  })
}
