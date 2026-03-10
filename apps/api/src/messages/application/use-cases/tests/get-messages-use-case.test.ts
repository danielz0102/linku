import { ConversationRepositoryMock } from "~/__test-utils__/mocks/conversation-repository-mock.ts"
import { MessageRepositoryMock } from "~/__test-utils__/mocks/message-repository-mock.ts"
import { ConversationMother } from "~/__test-utils__/mothers/conversation-mother.ts"
import { MessageMother } from "~/__test-utils__/mothers/message-mother.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import {
  GetMessagesUseCase,
  type GetMessagesData,
} from "~/messages/application/use-cases/get-messages-use-case.ts"
import { faker } from "@faker-js/faker"

const conversationRepo = new ConversationRepositoryMock()
const messageRepo = new MessageRepositoryMock()
const useCase = new GetMessagesUseCase({ conversationRepo, messageRepo })

test("returns messages for a conversation", async () => {
  const user = UserMother.create()
  const conversation = ConversationMother.create({
    participantOneId: user.id,
  })
  const messages = [
    MessageMother.create({ conversationId: conversation.id }),
    MessageMother.create({ conversationId: conversation.id }),
  ]

  conversationRepo.findById.mockResolvedValueOnce(conversation)
  messageRepo.findByConversation.mockResolvedValueOnce(messages)

  const result = await useCase.execute(
    createDTO(user.id, conversation.id)
  )

  expect(result.ok).toBe(true)
  if (result.ok) {
    expect(result.data).toHaveLength(2)
  }
})

test("fails if conversation is not found", async () => {
  conversationRepo.findById.mockResolvedValueOnce(undefined)

  const result = await useCase.execute(
    createDTO(faker.string.uuid(), faker.string.uuid())
  )

  expect(result.ok).toBe(false)
})

test("fails if user is not a participant in the conversation", async () => {
  const outsiderUser = UserMother.create()
  const conversation = ConversationMother.create()

  conversationRepo.findById.mockResolvedValueOnce(conversation)

  const result = await useCase.execute(
    createDTO(outsiderUser.id, conversation.id)
  )

  expect(result.ok).toBe(false)
})

function createDTO(
  userId: string,
  conversationId: string,
  overrides?: Partial<GetMessagesData>
): GetMessagesData {
  return {
    userId,
    conversationId,
    ...overrides,
  }
}
