import { Message } from "~/messages/domain/message.ts"
import { faker } from "@faker-js/faker"
import type { LinkuAPI } from "@linku/api-contract"

export const MessageMother = {
  create(overrides: Partial<Message> = {}): Message {
    return new Message({
      id: faker.string.uuid(),
      conversationId: faker.string.uuid(),
      senderId: faker.string.uuid(),
      content: faker.lorem.sentence(),
      createdAt: faker.date.recent(),
      ...overrides,
    })
  },
  createPublicMessage(overrides: Partial<LinkuAPI.Message> = {}): LinkuAPI.Message {
    return MessageMother.create(overrides).toPublic()
  },
}
