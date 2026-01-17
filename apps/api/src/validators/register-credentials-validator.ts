import z from "zod"

const schema = z.object({
  username: z.string().nonempty(),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "must contain at least one uppercase letter")
    .regex(/[a-z]/, "must contain at least one lowercase letter")
    .regex(/[0-9]/, "must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "must contain at least one special character"),
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
})

export function validateRegisterCredentials(data: unknown) {
  const result = schema.safeParse(data)

  if (!result.success) {
    return { data: null, error: z.treeifyError(result.error) }
  }

  return { data: result.data, error: null }
}
