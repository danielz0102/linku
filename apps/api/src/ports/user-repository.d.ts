import { UserRecord } from "#db/drizzle/schemas.js"

type UserQueryableFields = Pick<UserRecord, "id" | "username" | "email">
type Filters = Partial<UserQueryableFields>

interface UserRepository {
  findBy(filters: Filters): Promise<UserRecord | undefined>
}
