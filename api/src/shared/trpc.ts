import { initTRPC } from "@trpc/server"
import type { CreateHTTPContextOptions } from "@trpc/server/adapters/standalone"

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export async function createContext({ req }: CreateHTTPContextOptions) {
  return { req }
}

export type Context = Awaited<ReturnType<typeof createContext>>
