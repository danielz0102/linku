import z from "zod"

export const updateUserSchema = z.object({
  username: z.string().trim().nonempty("Username is empty").optional(),
  email: z.email("Invalid email address").optional(),
  firstName: z.string().trim().nonempty("First name is empty").optional(),
  lastName: z.string().trim().nonempty("Last name is empty").optional(),
  bio: z.string().optional(),
})
