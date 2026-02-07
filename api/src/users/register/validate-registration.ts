import type { ErrorBody } from "#types.d.js"
import type { RequestHandler } from "express"
import z from "zod"

export const validateRegistration: RequestHandler<unknown, ErrorBody> = (
  req,
  res,
  next
) => {
  const result = registrationSchema.safeParse(req.body)

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: mapZodError(result.error),
    })
  }

  next()
}

const registrationSchema = z.object({
  username: z.string().trim().nonempty("Username is empty"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  firstName: z.string().trim().nonempty("First name is empty"),
  lastName: z.string().trim().nonempty("Last name is empty"),
})

function mapZodError(
  error: z.ZodError<z.infer<typeof registrationSchema>>
): ErrorBody["errors"] {
  const flattened = z.treeifyError(error).properties

  if (!flattened) {
    return []
  }

  return Object.entries(flattened).map(([field, details]) => ({
    field,
    details: details.errors[0],
  }))
}
