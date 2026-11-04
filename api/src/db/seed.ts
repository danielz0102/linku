import { randomUUID } from "node:crypto"
import { env } from "node:process"

import { faker } from "@faker-js/faker"
import bcrypt from "bcryptjs"
import { eq, like, notExists } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { chatMembers, chats, files, messages, users } from "#db/drizzle/schemas.ts"

const SEED_PREFIX = "seed_"
const SEEDED_PASSWORD = "password123"
const USER_COUNT = 100
const CHAT_PAIRS = createChatPairs(USER_COUNT)

faker.seed(2026)

function createChatPairs(userCount: number) {
  if (userCount < 2) return []

  // Pair each user with the next one, wrapping around to form a ring. With
  // exactly two users, the ring would contain the same pair twice.
  const pairCount = userCount === 2 ? 1 : userCount

  return Array.from({ length: pairCount }, (_, index) => [index, (index + 1) % userCount] as const)
}

async function main() {
  if ((env["NODE_ENV"] ?? "production") === "production") {
    throw new Error("Refusing to seed the database when NODE_ENV is production")
  }

  console.log("Seeding development database...")

  const hashedPassword = await bcrypt.hash(SEEDED_PASSWORD, 10)

  const seededUsers = await db.transaction(async (tx) => {
    // Remove data from previous seed runs. Deleting users cascades to chat
    // members and messages, but leaves the chats themselves behind.
    await tx.delete(users).where(like(users.username, `${SEED_PREFIX}%`))
    await tx
      .delete(chats)
      .where(
        notExists(
          tx
            .select({ chatId: chatMembers.chatId })
            .from(chatMembers)
            .where(eq(chatMembers.chatId, chats.id))
        )
      )
    await tx.delete(files).where(like(files.publicId, `${SEED_PREFIX}%`))

    const profilePictures = await tx
      .insert(files)
      .values(
        Array.from({ length: USER_COUNT }, () => ({
          publicId: `${SEED_PREFIX}${randomUUID()}`,
          publicUrl: faker.image.avatar(),
        }))
      )
      .returning({ id: files.id })

    const insertedUsers = await tx
      .insert(users)
      .values(
        Array.from({ length: USER_COUNT }, (_, index) => {
          const firstName = faker.person.firstName()
          const lastName = faker.person.lastName()

          return {
            firstName,
            lastName,
            username: `${SEED_PREFIX}${faker.internet
              .username()
              .toLowerCase()
              .replace(/[^a-z0-9._-]/g, "")}_${index}`,
            hashedPassword,
            profilePictureId: profilePictures[index]!.id,
            bio: faker.helpers.maybe(() => faker.person.bio(), { probability: 0.7 }) ?? null,
          }
        })
      )
      .returning({ id: users.id, username: users.username })

    for (const [senderIndex, peerIndex] of CHAT_PAIRS) {
      const sender = insertedUsers[senderIndex]!
      const peer = insertedUsers[peerIndex]!

      const chat = await tx
        .insert(chats)
        .values({})
        .returning({ id: chats.id })
        .then((rows) => rows[0]!)

      await tx.insert(chatMembers).values([
        {
          chatId: chat.id,
          userId: sender.id,
          lastReadAt:
            faker.helpers.maybe(() => faker.date.recent({ days: 2 }), {
              probability: 0.75,
            }) ?? null,
        },
        {
          chatId: chat.id,
          userId: peer.id,
          lastReadAt:
            faker.helpers.maybe(() => faker.date.recent({ days: 2 }), {
              probability: 0.75,
            }) ?? null,
        },
      ])

      const attachmentId = faker.datatype.boolean({ probability: 0.35 })
        ? await tx
            .insert(files)
            .values({
              publicId: `${SEED_PREFIX}${randomUUID()}`,
              publicUrl: faker.image.url(),
            })
            .returning({ id: files.id })
            .then((rows) => rows[0]!.id)
        : null

      const messageCount = faker.number.int({ min: 4, max: 10 })
      let sentAt = Date.now() - 24 * 60 * 60 * 1_000

      const chatMessages = Array.from({ length: messageCount }, (_, index) => {
        sentAt += faker.number.int({ min: 1, max: 90 }) * 60 * 1_000

        return {
          chatId: chat.id,
          senderId: index % 2 === 0 ? sender.id : peer.id,
          text: faker.lorem.sentence(),
          attachmentId: index === messageCount - 1 ? attachmentId : null,
          createdAt: new Date(sentAt),
        }
      })

      await tx.insert(messages).values(chatMessages)
    }

    return insertedUsers
  })

  console.log(`Seeded ${seededUsers.length} users and ${CHAT_PAIRS.length} chats.`)
  console.log(`All seeded users share the password "${SEEDED_PASSWORD}".`)
  console.log(`Usernames: ${seededUsers.map((user) => user.username).join(", ")}`)
}

await main()
