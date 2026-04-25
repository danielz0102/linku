import { randomUUID } from "node:crypto"

import { chatMembers, chats, messageReads, messages, users } from "#db/drizzle/schemas.ts"
import { getChats } from "#modules/chats/queries/get-chats/get-chats-query-handler.ts"

import { it } from "../helpers/db-context.ts"

describe("Get Chats Query Handler", () => {
  it("returns all chats for a user with the latest message per chat", async ({ db }) => {
    const [currentUser] = await db
      .insert(users)
      .values({
        username: `user-${randomUUID()}`,
        hashedPassword: "hashed",
        firstName: "Current",
        lastName: "User",
      })
      .returning({ id: users.id })
    const [peerOne] = await db
      .insert(users)
      .values({
        username: `peer-${randomUUID()}`,
        hashedPassword: "hashed",
        firstName: "Peer",
        lastName: "One",
      })
      .returning({ id: users.id })
    const [peerTwo] = await db
      .insert(users)
      .values({
        username: `peer-${randomUUID()}`,
        hashedPassword: "hashed",
        firstName: "Peer",
        lastName: "Two",
      })
      .returning({ id: users.id })

    const [chatOne] = await db.insert(chats).values({}).returning({ id: chats.id })
    const [chatTwo] = await db.insert(chats).values({}).returning({ id: chats.id })

    await db.insert(chatMembers).values([
      { chatId: chatOne!.id, userId: currentUser!.id },
      { chatId: chatOne!.id, userId: peerOne!.id },
      { chatId: chatTwo!.id, userId: currentUser!.id },
      { chatId: chatTwo!.id, userId: peerTwo!.id },
    ])

    const [chatOneOlder] = await db
      .insert(messages)
      .values({
        chatId: chatOne!.id,
        senderId: currentUser!.id,
        content: "older chat one",
        createdAt: new Date("2025-01-01T00:00:00.000Z"),
      })
      .returning({ id: messages.id })
    const [chatOneLatest] = await db
      .insert(messages)
      .values({
        chatId: chatOne!.id,
        senderId: peerOne!.id,
        content: "latest chat one",
        createdAt: new Date("2025-01-01T00:01:00.000Z"),
      })
      .returning({ id: messages.id, createdAt: messages.createdAt })
    await db.insert(messages).values({
      chatId: chatTwo!.id,
      senderId: currentUser!.id,
      content: "older chat two",
      createdAt: new Date("2025-01-01T00:02:00.000Z"),
    })
    const [chatTwoLatest] = await db
      .insert(messages)
      .values({
        chatId: chatTwo!.id,
        senderId: peerTwo!.id,
        content: "latest chat two",
        createdAt: new Date("2025-01-01T00:03:00.000Z"),
      })
      .returning({ id: messages.id, createdAt: messages.createdAt })

    const results = await getChats(currentUser!.id, db)
    const resultByChatId = new Map(results.map((chat) => [chat.id, chat]))

    expect(results).toHaveLength(2)
    expect(results.map((chat) => chat.id)).toEqual([chatTwo!.id, chatOne!.id])
    expect(resultByChatId.get(chatOne!.id)?.lastMessage.id).toBe(chatOneLatest!.id)
    expect(resultByChatId.get(chatOne!.id)?.lastMessage.content).toBe("latest chat one")
    expect(resultByChatId.get(chatOne!.id)?.lastMessage.createdAt).toBe(
      chatOneLatest!.createdAt.toISOString()
    )
    expect(resultByChatId.get(chatOne!.id)?.lastMessage.id).not.toBe(chatOneOlder!.id)

    expect(resultByChatId.get(chatTwo!.id)?.lastMessage.id).toBe(chatTwoLatest!.id)
    expect(resultByChatId.get(chatTwo!.id)?.lastMessage.content).toBe("latest chat two")
    expect(resultByChatId.get(chatTwo!.id)?.lastMessage.createdAt).toBe(
      chatTwoLatest!.createdAt.toISOString()
    )
  })

  it("returns last message as read if it has been read before", async ({ db }) => {
    const [currentUser] = await db
      .insert(users)
      .values({
        username: `user-${randomUUID()}`,
        hashedPassword: "hashed",
        firstName: "Current",
        lastName: "User",
      })
      .returning({ id: users.id })
    const [peer] = await db
      .insert(users)
      .values({
        username: `peer-${randomUUID()}`,
        hashedPassword: "hashed",
        firstName: "Peer",
        lastName: "User",
      })
      .returning({ id: users.id })
    const [chat] = await db.insert(chats).values({}).returning({ id: chats.id })

    await db.insert(chatMembers).values([
      { chatId: chat!.id, userId: currentUser!.id },
      { chatId: chat!.id, userId: peer!.id },
    ])

    const [lastMessage] = await db
      .insert(messages)
      .values({
        chatId: chat!.id,
        senderId: peer!.id,
        content: "hello",
        createdAt: new Date("2025-01-01T00:01:00.000Z"),
      })
      .returning({ id: messages.id })
    await db
      .insert(messageReads)
      .values({ messageId: lastMessage!.id, userId: currentUser!.id })

    const [result] = await getChats(currentUser!.id, db)

    expect(result?.lastMessage.id).toBe(lastMessage!.id)
    expect(result?.lastMessage.isRead).toBe(true)
  })
})
