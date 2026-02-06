import z from "zod"

const imageMimeTypeErrorDataSchema = z.object({
  error: z.string(),
  details: z.object({
    mimetype: z.string(),
    allowedMimeTypes: z.array(z.string()),
  }),
})

export type ImageMimeTypeErrorData = z.infer<
  typeof imageMimeTypeErrorDataSchema
>

export function isImageMimeTypeErrorData(
  data: unknown
): data is ImageMimeTypeErrorData {
  return imageMimeTypeErrorDataSchema.safeParse(data).success
}
