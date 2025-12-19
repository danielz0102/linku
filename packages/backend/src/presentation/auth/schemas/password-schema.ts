import z from "zod"
import { Password } from "~/domain/value-objects/password.js"

export const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .superRefine((val, ctx) => {
    const validation = Password.validate(val)

    if (!validation.isValid) {
      validation.errors.forEach((error) => {
        ctx.addIssue({
          code: "custom",
          message: error,
        })
      })
    }
  })
