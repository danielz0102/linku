import { User } from "#db/schemas.js"

type UserQueryableFields = Pick<User, "id" | "username" | "email">
type Filters = Partial<UserQueryableFields>

interface UserRepository {
  findBy(filters: Filters): Promise<User | undefined>
}
