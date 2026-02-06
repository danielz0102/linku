export type User = {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  pictureUrl: string | null
}

export type NewUser = {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  picture: File | null
}
