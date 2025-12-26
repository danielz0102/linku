import User from "~/domain/entities/user.js"

type UserMotherParams = Partial<ConstructorParameters<typeof User>[0]>

export const UserMother = {
  create({
    id = "user-id",
    username = "testuser",
    email = "testuser@example.com",
    passwordHash = "hashedpassword",
    profilePicUrl,
    status = "online",
  }: UserMotherParams): User {
    return new User({
      id,
      username,
      email,
      passwordHash,
      profilePicUrl,
      status,
    })
  },
}
