import { ConversationRepositoryMock } from "~/__test-utils__/mocks/conversation-repository-mock.ts"
import { ConversationMother } from "~/__test-utils__/mothers/conversation-mother.ts"
import { GetConversationsUseCase } from "~/messages/application/use-cases/get-conversations-use-case.ts"
import { faker } from "@faker-js/faker"

const conversationRepo = new ConversationRepositoryMock()
const useCase = new GetConversationsUseCase({ conversationRepo })

test("returns a list of conversations for the user", async () => {
  const userId = faker.string.uuid()
  const conversations = [
    ConversationMother.create({ participantOneId: userId }),
    ConversationMother.create({ participantTwoId: userId }),
  ]

  conversationRepo.findAllByUserId.mockResolvedValueOnce(conversations)

  const result = await useCase.execute(userId)

  expect(result).toHaveLength(2)
})

test("returns an empty list when the user has no conversations", async () => {
  conversationRepo.findAllByUserId.mockResolvedValueOnce([])

  const result = await useCase.execute(faker.string.uuid())

  expect(result).toHaveLength(0)
})
