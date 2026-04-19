import type { UserResponse } from "../user-response"

export async function getUser(username: string): Promise<UserResponse> {
  return {
    id: "123",
    username,
    firstName: "John",
    lastName: "Doe",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    profilePictureUrl: null,
  }
}
