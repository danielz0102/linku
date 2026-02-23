import type { RequestHandler } from "express"
import z from "zod"
import type { UpdateUserErrorBody } from "@linku/api-contract"

export const validateUpdateUser: RequestHandler<never, UpdateUserErrorBody> = (
  req,
  res,
  next
) => {
  const result = updateUserSchema.safeParse(req.body)

  if (!result.success) {
    const errors = mapZodError(result.error)

    if (!errors) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        message: "Invalid user data",
      })
    }

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message: "Invalid user data",
      errors: errors,
    })
  }

  next()
}

const updateUserSchema = z.object({
  username: z.string().trim().nonempty("Username is empty").optional(),
  email: z.email("Invalid email address").optional(),
  firstName: z.string().trim().nonempty("First name is empty").optional(),
  lastName: z.string().trim().nonempty("Last name is empty").optional(),
  bio: z.string().optional(),
})

function mapZodError(
  error: z.ZodError<z.infer<typeof updateUserSchema>>
): UpdateUserErrorBody["errors"] {
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
