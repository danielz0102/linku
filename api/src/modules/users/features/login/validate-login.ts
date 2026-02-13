import type { LoginErrorBody, LoginQuery } from "api-contract"
import type { RequestHandler } from "express"
import z from "zod"

export const validateLogin: RequestHandler<
  unknown,
  LoginErrorBody,
  unknown,
  LoginQuery
> = (req, res, next) => {
  const result = loginSchema.safeParse(req.query)

  if (!result.success) {
    const errors = mapZodError(result.error)

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid login data",
      errors: errors,
    })
  }

  next()
}

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is empty"),
})

function mapZodError(
  error: z.ZodError<z.infer<typeof loginSchema>>
): LoginErrorBody["errors"] {
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
