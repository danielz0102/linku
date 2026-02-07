import { User } from "#users/types.d.js"

export interface UserRepository {
  create: (newUser: NewUser) => Promise<User>
  search: (filters: Filters) => Promise<User | undefined>
}

type NewUser = {
  username: string
  email: string
  hashedPassword: string
  firstName: string
  lastName: string
  profilePicUrl?: string
  bio?: string
}

type Filters = AtLeastOne<{
  id: number
  email: string
  username: string
}>

type AtLeastOne<T> = Partial<T> &
  {
    [K in keyof T]-?: Required<Pick<T, K>>
  }[keyof T]
