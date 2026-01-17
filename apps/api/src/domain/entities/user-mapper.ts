import type { PublicUser, User } from "./user.js"

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profilePicUrl: user.profilePicUrl ?? null,
    status: user.status,
    bio: user.bio ?? null,
    signUpAt: user.signUpAt.toISOString(),
  }
}
