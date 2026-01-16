import z from "zod"

const loginCredentialsSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
})

export function validateLoginCredentials(data: unknown) {
  const result = loginCredentialsSchema.safeParse(data)

  if (!result.success) {
    return { data: null, error: z.treeifyError(result.error) }
  }

  return { data: result.data, error: null }
}
