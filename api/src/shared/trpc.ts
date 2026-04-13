import { initTRPC } from "@trpc/server"
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"

export const SESSION_COOKIE_NAME = "linku.sid"

export function createContext({ req, res }: CreateExpressContextOptions) {
  return {
    req,
    res,
    clearSession: () => {
      req.session.destroy((error) => {
        if (error) {
          console.error("Error destroying session:", error)
        } else {
          res.clearCookie(SESSION_COOKIE_NAME)
        }
      })
    },
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
