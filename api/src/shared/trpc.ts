import { initTRPC } from "@trpc/server"
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express"

export type Context = {
  req: CreateExpressContextOptions["req"]
  res: CreateExpressContextOptions["res"]
}

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export function createContext({ req, res }: CreateExpressContextOptions): Context {
  return { req, res }
}
