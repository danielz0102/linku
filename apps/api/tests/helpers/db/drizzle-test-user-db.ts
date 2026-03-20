import { faker } from "@faker-js/faker"
import { NodePgDatabase } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm/sql/expressions/conditions"

import { User } from "~/core/users/user.ts"
import { usersTable } from "~/db/drizzle/schemas.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

import type { Prefixes, TestUserDB } from "./test-user-db.ts"

export class DrizzleTestUserDB implements TestUserDB {
  constructor(private readonly db: NodePgDatabase) {}

  async insert(user: User): Promise<void> {
    await this.db.insert(usersTable).values(user.toPrimitives())
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async seed(count: number, prefixes?: Prefixes): Promise<User[]> {
    const uniques = {
      usernames: faker.helpers.uniqueArray(() => faker.internet.username(), count),
      emails: faker.helpers.uniqueArray(() => faker.internet.email(), count),
    }

    const users = Array.from({ length: count }, (_, i) => {
      return UserMother.create({
        username: `${prefixes?.username ?? "user"}-${uniques.usernames[i]}`,
        firstName: `${prefixes?.firstName ?? "FirstName"}-${faker.person.firstName()}`,
        lastName: `${prefixes?.lastName ?? "LastName"}-${faker.person.lastName()}`,
        email: uniques.emails[i],
      })
    })

    await this.db.insert(usersTable).values(users.map((u) => u.toPrimitives()))
    return users
  }
}
