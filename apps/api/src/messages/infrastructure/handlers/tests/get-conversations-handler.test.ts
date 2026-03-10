import request from "supertest"
import { faker } from "@faker-js/faker"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { GetConversationsUseCaseMock } from "~/__test-utils__/mocks/get-conversations-use-case-mock.ts"
import { ConversationMother } from "~/__test-utils__/mothers/conversation-mother.ts"
import { getConversationsHandler } from "../get-conversations-handler.ts"

const useCase = new GetConversationsUseCaseMock()
const userId = faker.string.uuid()

const app = new AppBuilder()
  .withSession()
  .withAuthenticatedUser(userId)
  .build()
app.get("/", getConversationsHandler(useCase))

test("sends 200 with a list of conversations", async () => {
  const conversations = [
    ConversationMother.createPublicConversation(),
    ConversationMother.createPublicConversation(),
  ]
  useCase.execute.mockResolvedValueOnce(conversations)

  await request(app).get("/").expect(200).expect(conversations)
})

test("sends 200 with an empty list when user has no conversations", async () => {
  useCase.execute.mockResolvedValueOnce([])

  await request(app).get("/").expect(200).expect([])
})
