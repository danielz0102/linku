import z from "zod"

const registrationErrorDataSchema = z.object({
  errors: z.object({
    formErrors: z.array(z.string()),
    fieldErrors: z.object({
      firstName: z.array(z.string()).optional(),
      lastName: z.array(z.string()).optional(),
      username: z.array(z.string()).optional(),
      email: z.array(z.string()).optional(),
      password: z.array(z.string()).optional(),
    }),
  }),
})

type RegistrationErrorData = z.infer<typeof registrationErrorDataSchema>

export function isRegistrationErrorData(
  data: unknown
): data is RegistrationErrorData {
  return registrationErrorDataSchema.safeParse(data).success
}
