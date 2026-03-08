import z from "zod"

export const updateUserSchema = z
  .object({
    username: z.string().trim().nonempty("Username is empty"),
    email: z.email("Invalid email address"),
    firstName: z.string().trim().nonempty("First name is empty"),
    lastName: z.string().trim().nonempty("Last name is empty"),
    bio: z.string().trim(),
    profilePicUrl: z
      .url("Profile picture URL must be a valid HTTPS URL")
      .startsWith("https://", "Profile picture URL must be a valid HTTPS URL"),
  })
  .partial()
