import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERNS,
} from "#domain/constants/password-patterns.js"
import z from "zod"

const schema = z.object({
  username: z.string().nonempty(),
  email: z.email(),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH)
    .regex(
      PASSWORD_PATTERNS.UPPERCASE,
      "must contain at least one uppercase letter"
    )
    .regex(
      PASSWORD_PATTERNS.LOWERCASE,
      "must contain at least one lowercase letter"
    )
    .regex(PASSWORD_PATTERNS.DIGIT, "must contain at least one number")
    .regex(
      PASSWORD_PATTERNS.SPECIAL_CHAR,
      "must contain at least one special character"
    ),
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
