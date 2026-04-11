import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { signUp } from "#modules/users/commands/sign-up/sign-up-service.ts"
import { publicProcedure } from "#shared/trpc.ts"

export const signUpProcedure = publicProcedure
  .input(
    z.object({
      username: z.string().trim().nonempty(),
      firstName: z.string().trim().nonempty(),
      lastName: z.string().trim().nonempty(),
      password: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[^a-zA-Z0-9])/, "Password must contain at least one special character"),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const id = await signUp(input)

    if (!id) {
      throw new TRPCError({ code: "CONFLICT", message: "Username already exists" })
    }

    ctx.req.session.userId = id
  })
