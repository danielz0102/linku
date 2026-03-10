import { Conversation } from "~/messages/domain/conversation.ts"
import { faker } from "@faker-js/faker"
import type { LinkuAPI } from "@linku/api-contract"

export const ConversationMother = {
  create(overrides: Partial<Conversation> = {}): Conversation {
    return new Conversation({
      id: faker.string.uuid(),
      participantOneId: faker.string.uuid(),
      participantTwoId: faker.string.uuid(),
      lastMessageAt: faker.date.recent(),
      createdAt: faker.date.past(),
      ...overrides,
    })
  },
  createPublicConversation(
    overrides: Partial<LinkuAPI.Conversation> = {}
  ): LinkuAPI.Conversation {
    return ConversationMother.create(overrides).toPublic()
  },
}
