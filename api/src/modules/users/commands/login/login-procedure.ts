import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { publicProcedure } from "#shared/trpc.ts"

import { login } from "./login-service.ts"

export const loginProcedure = publicProcedure
  .input(
    z.object({
      username: z.string().trim().nonempty(),
      password: z.string().trim().nonempty(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const id = await login(input)

    if (!id) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" })
    }

    ctx.req.session.userId = id
  })
