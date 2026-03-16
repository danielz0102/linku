import { faker } from "@faker-js/faker"
import { eq } from "drizzle-orm/sql/expressions/conditions"
import { reset } from "drizzle-seed"

import { db } from "~/api/shared/drizzle/db.ts"
import { usersTable } from "~/api/shared/drizzle/schemas.ts"
import { User } from "~/core/users/user.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

import type { Prefixes, TestUserDAO } from "./test-user-dao.ts"

export class DrizzleTestUserDAO implements TestUserDAO {
  async insert(user: User): Promise<void> {
    await db.insert(usersTable).values(user.toPrimitives())
  }

  async deleteById(id: string): Promise<void> {
    await db.delete(usersTable).where(eq(usersTable.id, id))
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async reset(): Promise<void> {
    await reset(db, usersTable)
  }

  async seed(count: number, prefixes?: Prefixes): Promise<User[]> {
    const users = Array.from({ length: count }, (_, i) => {
      return UserMother.create({
        username: `${prefixes?.username ?? "user"}-${faker.internet.username()}-${i}`,
        firstName: `${prefixes?.firstName ?? "FirstName"}-${faker.person.firstName()}`,
        lastName: `${prefixes?.lastName ?? "LastName"}-${faker.person.lastName()}`,
      })
    })

    await db.insert(usersTable).values(users.map((u) => u.toPrimitives()))
    return users
  }
}
