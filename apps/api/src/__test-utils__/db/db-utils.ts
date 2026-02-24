import { hashSync } from "bcryptjs"
import { faker } from "@faker-js/faker"
import db from "~/shared/db/drizzle/index.ts"
import { usersTable } from "~/shared/db/drizzle/schemas.ts"

export const TEST_PASSWORD = "Password1!"
export const HASHED_TEST_PASSWORD = hashSync(TEST_PASSWORD, 10)

export async function clearUsers() {
  await db.delete(usersTable)
}

export async function createTestUser(
  overrides: Partial<typeof usersTable.$inferInsert> = {}
) {
  const [user] = await db
    .insert(usersTable)
    .values({
      username: faker.internet.username(),
      email: faker.internet.email(),
      hashedPassword: HASHED_TEST_PASSWORD,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ...overrides,
    })
    .returning()

  if (!user) {
    throw new Error("Failed to create test user")
  }

  return user
}
