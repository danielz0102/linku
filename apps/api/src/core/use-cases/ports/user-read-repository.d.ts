import type { PublicUser } from "../dtos/public-user.ts"

export interface UserReadRepository {
  search(filters: UserFilters, pagination: Pagination): Promise<PublicUser[]>
}

export type UserFilters = Partial<{
  username: string
  firstName: string
  lastName: string
}>

export type Pagination = {
  limit?: number
  offset?: number
}
