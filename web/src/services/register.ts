import type { User } from "~/types"
import apiClient from "./api-client"

type NewUser = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  picture: File | null
}

export async function register({
  username,
  email,
  firstName,
  lastName,
  password,
  picture,
}: NewUser): Promise<User> {
  const formData = new FormData()
  formData.append("firstName", firstName)
  formData.append("lastName", lastName)
  formData.append("username", username)
  formData.append("email", email)
  formData.append("password", password)

  if (picture) {
    formData.append("picture", picture)
  }

  const { data } = await apiClient.post<User>("/register", formData)

  return data
}
