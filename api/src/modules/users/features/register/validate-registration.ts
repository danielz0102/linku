import type { RequestHandler } from "express"
import z from "zod"
import type { RegistrationErrorBody } from "api-contract"

export const validateRegistration: RequestHandler<
  unknown,
  RegistrationErrorBody
> = (req, res, next) => {
  const result = registrationSchema.safeParse(req.body)

  if (!result.success) {
    const errors = mapZodError(result.error)

    if (!errors) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Registration data is missing",
      })
    }

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid registration data",
      errors: errors,
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
): RegistrationErrorBody["errors"] {
  const flattened = z.treeifyError(error).properties

  if (!flattened) {
    return
  }

  const result = Object.entries(flattened).reduce(
    (acc, [k, v]) => ({
      ...acc,
      [k]: v.errors[0],
    }),
    {}
  )

  return result
}
