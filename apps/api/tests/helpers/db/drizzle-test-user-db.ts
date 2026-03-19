import { faker } from "@faker-js/faker"
import { randomUUID } from "node:crypto"
import { eq } from "drizzle-orm/sql/expressions/conditions"
import { drizzle } from "drizzle-orm/node-postgres"
import { sql } from "drizzle-orm/sql"
import { Pool } from "pg"

import { User } from "~/core/users/user.ts"
import { DATABASE_URL } from "~/env.ts"
import { usersTable } from "~/db/drizzle/schemas.ts"
import { UserMother } from "~tests/helpers/users/user-mother.ts"

import type { Prefixes, TestUserDB } from "./test-user-db.ts"

export class DrizzleTestUserDB implements TestUserDB {
  readonly #schema = `test_${randomUUID().replaceAll("-", "")}`
  readonly #pool = new Pool({
    connectionString: createSchemaDatabaseUrl(DATABASE_URL, this.#schema),
  })
  readonly #db = drizzle(this.#pool)
  #isReady = false

  get db() {
    return this.#db
  }

  async #ready() {
    if (this.#isReady) return

    await this.#db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "${this.#schema}"`))
    await this.#db.execute(sql.raw(`SET search_path TO "${this.#schema}", public`))
    await this.#db.execute(sql`
      CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
        id SERIAL PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `)
    await this.#db.execute(sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY NOT NULL,
        "username" varchar(50) NOT NULL UNIQUE,
        "email" varchar(100) NOT NULL UNIQUE,
        "hashedPassword" text NOT NULL,
        "firstName" varchar(50) NOT NULL,
        "lastName" varchar(50) NOT NULL,
        "profilePicUrl" text,
        "bio" text
      )
    `)
    await this.#db.execute(sql`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" uuid PRIMARY KEY NOT NULL,
        "senderId" uuid NOT NULL REFERENCES "users"("id"),
        "receiverId" uuid NOT NULL REFERENCES "users"("id"),
        "content" text NOT NULL,
        "timestamp" timestamp with time zone NOT NULL DEFAULT now()
      )
    `)

    this.#isReady = true
  }

  async insert(user: User): Promise<void> {
    await this.#ready()
    await this.#db.insert(usersTable).values(user.toPrimitives())
  }

  async findByUsername(username: string): Promise<User | undefined> {
    await this.#ready()
    return this.#db
      .select()
      .from(usersTable)
      .where(eq(usersTable.username, username))
      .then(([r]) => (r ? new User(r) : undefined))
  }

  async reset(): Promise<void> {
    await this.#ready()
    await this.#db.execute(sql`TRUNCATE TABLE "messages" CASCADE`)
    await this.#db.execute(sql`TRUNCATE TABLE "users" CASCADE`)
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

    await this.#ready()
    await this.#db.insert(usersTable).values(users.map((u) => u.toPrimitives()))
    return users
  }
}

function createSchemaDatabaseUrl(baseUrl: string, schema: string): string {
  const url = new URL(baseUrl)
  const options = url.searchParams.get("options")
  const searchPathOption = `-c search_path=${schema},public`
  url.searchParams.set("options", options ? `${options} ${searchPathOption}` : searchPathOption)
  return url.toString()
}
