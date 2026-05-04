import { faker } from "@faker-js/faker"
import bcrypt from "bcryptjs"
import { inArray } from "drizzle-orm"
import { test as base } from "vitest"

import { db } from "#db/drizzle/drizzle-client.ts"
import { files, users } from "#db/drizzle/schemas.ts"

type UserOverrides = Partial<{
  username: string
  password: string
  firstName: string
  lastName: string
  profilePictureUrl: string | null
}>

export const it = base.extend("createUser", async ({}, { onCleanup }) => {
  const userIds: string[] = []
  const pictureIds: string[] = []

  onCleanup(async () => {
    await Promise.all([
      db.delete(users).where(inArray(users.id, userIds)),
      db.delete(files).where(inArray(files.id, pictureIds)),
    ])
  })

  return async (overrides: UserOverrides = {}) => {
    const data: Required<UserOverrides> = {
      username: overrides.username ?? faker.internet.username(),
      password: overrides.password ?? faker.internet.password(),
      firstName: overrides.firstName ?? faker.person.firstName(),
      lastName: overrides.lastName ?? faker.person.lastName(),
      profilePictureUrl: null,
    }

    let pictureId: string | null = null

    if (overrides.profilePictureUrl === undefined) {
      data.profilePictureUrl = faker.image.avatar()

      pictureId = await db
        .insert(files)
        .values({
          publicId: faker.string.alphanumeric({ length: { min: 10, max: 20 } }),
          publicUrl: data.profilePictureUrl,
        })
        .returning({ id: files.id })
        .then((r) => r[0]!.id)

      pictureIds.push(pictureId!)
    }

    const userId = await db
      .insert(users)
      .values({
        username: data.username,
        hashedPassword: await bcrypt.hash(data.password, 1),
        firstName: data.firstName,
        lastName: data.lastName,
        profilePictureId: pictureId,
      })
      .returning({ id: users.id })
      .then((r) => r[0]!.id)

    userIds.push(userId)

    return { id: userId, ...data }
  }
})
