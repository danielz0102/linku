import { ConversationRepositoryMock } from "~/__test-utils__/mocks/conversation-repository-mock.ts"
import { MessageRepositoryMock } from "~/__test-utils__/mocks/message-repository-mock.ts"
import { ConversationMother } from "~/__test-utils__/mothers/conversation-mother.ts"
import { MessageMother } from "~/__test-utils__/mothers/message-mother.ts"
import { UserMother } from "~/__test-utils__/mothers/user-mother.ts"
import {
  SendMessageUseCase,
  type SendMessageData,
} from "~/messages/application/use-cases/send-message-use-case.ts"
import { faker } from "@faker-js/faker"

const conversationRepo = new ConversationRepositoryMock()
const messageRepo = new MessageRepositoryMock()
const useCase = new SendMessageUseCase({ conversationRepo, messageRepo })

beforeEach(() => {
  vi.clearAllMocks()
})

test("creates a new conversation and sends a message", async () => {
  const sender = UserMother.create()
  const recipient = UserMother.create()
  const conversation = ConversationMother.create({
    participantOneId: sender.id,
    participantTwoId: recipient.id,
  })
  const message = MessageMother.create({
    conversationId: conversation.id,
    senderId: sender.id,
  })

  conversationRepo.findByParticipants.mockResolvedValueOnce(undefined)
  conversationRepo.create.mockResolvedValueOnce(conversation)
  messageRepo.create.mockResolvedValueOnce(message)
  conversationRepo.updateLastMessageAt.mockResolvedValueOnce(conversation)

  const result = await useCase.execute(createDTO(sender.id, recipient.id))

  expect(result.ok).toBe(true)
  expect(conversationRepo.create).toHaveBeenCalledOnce()
  expect(messageRepo.create).toHaveBeenCalledOnce()
})

test("reuses an existing conversation", async () => {
  const sender = UserMother.create()
  const recipient = UserMother.create()
  const conversation = ConversationMother.create({
    participantOneId: sender.id,
    participantTwoId: recipient.id,
  })
  const message = MessageMother.create({
    conversationId: conversation.id,
    senderId: sender.id,
  })

  conversationRepo.findByParticipants.mockResolvedValueOnce(conversation)
  messageRepo.create.mockResolvedValueOnce(message)
  conversationRepo.updateLastMessageAt.mockResolvedValueOnce(conversation)

  const result = await useCase.execute(createDTO(sender.id, recipient.id))

  expect(result.ok).toBe(true)
  expect(conversationRepo.create).not.toHaveBeenCalled()
  expect(messageRepo.create).toHaveBeenCalledOnce()
})

test("fails if sender and recipient are the same user", async () => {
  const userId = faker.string.uuid()

  const result = await useCase.execute(createDTO(userId, userId))

  expect(result.ok).toBe(false)
})

function createDTO(
  senderId: string,
  recipientId: string,
  overrides?: Partial<SendMessageData>
): SendMessageData {
  return {
    senderId,
    recipientId,
    content: faker.lorem.sentence(),
    ...overrides,
  }
}
