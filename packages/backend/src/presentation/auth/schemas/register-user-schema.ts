import z from "zod"
import { passwordSchema } from "./password-schema.js"

export const registerUserSchema = z.object({
  body: z.object({
    email: z.email("Invalid email address"),
    username: z.string().trim().nonempty("Username is required"),
    password: passwordSchema,
  }),
})
