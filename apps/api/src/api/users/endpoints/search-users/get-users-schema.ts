import { z } from "zod"

export const getUsersSchema = z
  .object({
    q: z.string().trim().nonempty("Query cannot be empty"),
    limit: z.coerce.number().int().positive("Limit must be a positive integer").optional(),
    offset: z.coerce.number().int().nonnegative("Offset must be a non-negative integer").optional(),
  })
  .partial()
