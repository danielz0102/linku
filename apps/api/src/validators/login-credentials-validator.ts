import { validateSchema } from "#lib/validate-schema.js"
import z from "zod"

const schema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
})

export function validateLoginCredentials(data: unknown) {
  return validateSchema(data, schema)
}
