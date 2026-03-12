import type { PublicUser } from "../dtos/public-user.js"

export interface UserReadRepository {
  search(query: string, limit?: number, offset?: number): Promise<PublicUser[]>
}
