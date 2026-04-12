import { z } from "zod"

import { login } from "#modules/users/commands/login/login-service.ts"
import { publicProcedure } from "#shared/trpc.ts"

export const loginProcedure = publicProcedure
  .input(
    z.object({
      username: z.string().trim().nonempty(),
      password: z.string().trim().nonempty(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    await login(input, ctx.req.session)
  })
