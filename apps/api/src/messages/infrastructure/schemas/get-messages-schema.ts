import z from "zod"

export const getMessagesSchema = z.object({
  limit: z.string().optional(),
  offset: z.string().optional(),
})
