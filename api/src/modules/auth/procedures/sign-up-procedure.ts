import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { userRepo } from "../../../shared/implementations/drizzle-user-repository.ts"
import { publicProcedure } from "../../../shared/trpc.ts"
import { hasher } from "../implementations/bcrypt-hasher.ts"
import { SignUpService } from "../services/sign-up-service.ts"

export const signUp = publicProcedure
  .input(
    z.object({
      username: z.string().trim().min(3).max(20),
      firstName: z.string().trim().nonempty().max(30),
      lastName: z.string().trim().nonempty().max(30),
      password: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[^a-zA-Z0-9])/, "Password must contain at least one special character"),
    })
  )
  .mutation(async ({ input }) => {
    const service = new SignUpService(userRepo, hasher)
    const user = await service.execute(input)

    if (!user) {
      throw new TRPCError({ code: "CONFLICT", message: "Username already exists" })
    }

    //4. Create session (cookie)
    //5. Return the user data (without password)
  })
