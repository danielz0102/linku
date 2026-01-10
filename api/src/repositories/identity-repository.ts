import { eq } from "drizzle-orm"
import db from "~/db/drizzle/index.js"
import {
  identitiesTable,
  type Identity,
  type NewIdentity,
} from "~/db/drizzle/schema.js"

export class IdentityRepository {
  async findBySub(sub: string): Promise<Identity | undefined> {
    return await db
      .select()
      .from(identitiesTable)
      .where(eq(identitiesTable.sub, sub))
      .limit(1)
      .then((r) => r[0])
  }

  async create(data: NewIdentity): Promise<Identity> {
    const newIdentity = await db
      .insert(identitiesTable)
      .values(data)
      .returning()
      .then((r) => r[0])

    if (!newIdentity) {
      throw new Error("Failed to create new identity")
    }

    return newIdentity
  }
}
