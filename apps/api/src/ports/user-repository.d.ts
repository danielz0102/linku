type UserQueryableFields = Pick<User, "id" | "username" | "email">
type Filters = Partial<UserQueryableFields>

type NewUser = {
  username: string
  email: string
  lastName: string
  firstName: string
  hashedPassword?: string
  profilePicId?: string
  bio?: string
}

interface UserRepository {
  findBy(filters: Filters): Promise<User | undefined>
  create(user: NewUser): Promise<User>
}
