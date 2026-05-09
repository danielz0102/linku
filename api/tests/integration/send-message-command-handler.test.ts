import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { chats, messages } from "#db/drizzle/schemas.ts"
import { SendMessageCommandHandler } from "#modules/chats/commands/send-message/send-message-command-handler.ts"
import { it } from "~/context/create-user.ts"

describe("Send Message Command Handler", () => {
  const sendMessage = new SendMessageCommandHandler(db)

  it("returns the new message when sender and peer exist", async ({ createUser }) => {
    const [sender, peer] = await Promise.all([createUser(), createUser()])

    const result = await sendMessage.execute({
      senderId: sender.id,
      peerUsername: peer.username,
      text: "Hello there",
    })

    assert(result.ok)
    expect(result.data.text).toBe("Hello there")
    expect(result.data.senderId).toBe(sender.id)
    expect(result.data.attachmentUrl).toBeNull()

    const chatId = await db
      .select({ chatId: messages.chatId })
      .from(messages)
      .where(eq(messages.id, result.data.id))
      .then((rows) => rows[0]!.chatId)

    onTestFinished(async () => {
      await db.delete(chats).where(eq(chats.id, chatId))
    })
  })

  it("fails if peer does not exist", async ({ createUser }) => {
    const sender = await createUser()

    const result = await sendMessage.execute({
      senderId: sender.id,
      peerUsername: `missing-${randomUUID()}`,
      text: "Hello",
    })

    expect(result.ok).toBe(false)
  })

  it("throws if sender does not exist", async ({ createUser }) => {
    const peer = await createUser()

    await expect(() =>
      sendMessage.execute({
        senderId: randomUUID(),
        peerUsername: peer.username,
        text: "Hello",
      })
    ).rejects.toThrow()
  })

  it("fails if content is invalid", async ({ createUser }) => {
    const sender = await createUser()
    const peer = await createUser()

    const result = await sendMessage.execute({
      senderId: sender.id,
      peerUsername: peer.username,
      text: "   ",
    })

    expect(result.ok).toBe(false)
  })
})
