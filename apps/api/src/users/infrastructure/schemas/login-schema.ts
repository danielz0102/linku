import z from "zod"

export const loginSchema = z.object({
  username: z.string().trim().nonempty("Username is empty"),
  password: z.string().trim().nonempty("Password is empty"),
})
