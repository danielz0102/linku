import { z } from "zod"

export function mapZodError(
  error: z.ZodError<Record<string, unknown>>
): Record<string, string> | undefined {
  const { properties } = z.treeifyError(error)

  if (!properties) {
    return
  }

  return Object.entries(properties).reduce<Record<string, string>>((acc, [k, v]) => {
    if (!v) {
      return acc
    }

    const firstError = v.errors[0]

    if (!firstError) {
      return acc
    }

    acc[k] = firstError
    return acc
  }, {})
}
