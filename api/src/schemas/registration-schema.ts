import z from "zod"

export const registrationSchema = z.object({
  body: z.object({
    username: z.string().trim().nonempty("Username is required"),
    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[\W_]/, "Password must contain at least one special character"),
    firstName: z.string().trim().nonempty("First name is required"),
    lastName: z.string().trim().nonempty("Last name is required"),
  }),
})
