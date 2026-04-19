import type { UserResponse } from "../user-response"

export async function searchUsers(query: string): Promise<UserResponse[]> {
  const searchTerm = query.trim().toLowerCase()

  return DUMMY_USERS.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase()
    const username = user.username.toLowerCase()

    return fullName.includes(searchTerm) || username.includes(searchTerm)
  }).map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    profilePictureUrl: user.profilePictureUrl,
    bio: user.bio,
  }))
}

const DUMMY_USERS: UserResponse[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    username: "johndoe",
    profilePictureUrl: "https://cataas.com/cat",
    bio: "Coffee-first developer",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    username: "janesmith",
    profilePictureUrl: null,
    bio: "Frontend enthusiast",
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Mendez",
    username: "carlitos",
    profilePictureUrl: "https://cataas.com/cat/says/hi",
    bio: "Always shipping",
  },
]
