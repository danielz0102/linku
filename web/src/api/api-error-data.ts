import z from "zod"

export type ApiErrorData = z.infer<typeof apiErrorDataSchema>

export function isApiErrorData(data: unknown): data is ApiErrorData {
  return apiErrorDataSchema.safeParse(data).success
}

const apiErrorDataSchema = z.object({
  message: z.string(),
  errors: z.array(
    z.object({
      field: z.string(),
      details: z.string(),
    })
  ),
})
