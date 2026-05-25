import { randomUUID } from "node:crypto"

import { eq } from "drizzle-orm"

import { db } from "#db/drizzle/drizzle-client.ts"
import { chats } from "#db/drizzle/schemas.ts"
import { SendMessageCommandHandler } from "#modules/chats/commands/send-message/send-message-command-handler.ts"
import { it } from "~/context/create-user.ts"

describe("Send Message Command Handler", () => {
  const sendMessage = new SendMessageCommandHandler(db)

  it("returns the new message when sender and peer exist", async ({ createUser }) => {
    const [sender, peer] = await Promise.all([createUser(), createUser()])

    const message = await sendMessage.execute({
      senderId: sender.id,
      peerId: peer.id,
      text: "Hello there",
    })

    expect(message.text).toBe("Hello there")
    expect(message.senderId).toBe(sender.id)
    expect(message.attachmentUrl).toBeNull()

    onTestFinished(async () => {
      await db.delete(chats).where(eq(chats.id, message.chatId))
    })
  })

  it("throws if peer does not exist", async ({ createUser }) => {
    const sender = await createUser()

    await expect(() =>
      sendMessage.execute({
        senderId: sender.id,
        peerId: `missing-${randomUUID()}`,
        text: "Hello",
      })
    ).rejects.toThrow()
  })

  it("throws if sender does not exist", async ({ createUser }) => {
    const peer = await createUser()

    await expect(() =>
      sendMessage.execute({
        senderId: randomUUID(),
        peerId: peer.id,
        text: "Hello",
      })
    ).rejects.toThrow()
  })
})
