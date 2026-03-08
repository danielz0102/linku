import z from "zod"

export const getUsersSchema = z
  .object({
    username: z.string().trim().min(1, "Username is empty"),
    firstName: z.string().trim().min(1, "First name is empty"),
    lastName: z.string().trim().min(1, "Last name is empty"),
    limit: z.coerce
      .number()
      .int()
      .positive("Limit must be a positive integer")
      .optional(),
    offset: z.coerce
      .number()
      .int()
      .nonnegative("Offset must be a non-negative integer")
      .optional(),
  })
  .partial()
