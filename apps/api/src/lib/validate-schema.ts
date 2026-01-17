import { z } from "zod"

export function validateSchema<T extends z.ZodRawShape>(
  data: unknown,
  schema: z.ZodObject<T>
) {
  const result = schema.safeParse(data)

  if (!result.success) {
    return { data: null, error: z.treeifyError(result.error) }
  }

  return { data: result.data, error: null }
}
