import request from "supertest"
import { faker } from "@faker-js/faker"
import { AppBuilder } from "~/__test-utils__/builders/app-builder.ts"
import { GetMessagesUseCaseMock } from "~/__test-utils__/mocks/get-messages-use-case-mock.ts"
import { MessageMother } from "~/__test-utils__/mothers/message-mother.ts"
import { getMessagesHandler } from "../get-messages-handler.ts"

const useCase = new GetMessagesUseCaseMock()
const userId = faker.string.uuid()
const conversationId = faker.string.uuid()

const app = new AppBuilder()
  .withSession()
  .withAuthenticatedUser(userId)
  .build()
app.get("/:conversationId/messages", getMessagesHandler(useCase))

test("sends 200 with a list of messages", async () => {
  const messages = [
    MessageMother.createPublicMessage({ conversationId }),
    MessageMother.createPublicMessage({ conversationId }),
  ]
  useCase.execute.mockResolvedValueOnce({ ok: true, data: messages })

  await request(app)
    .get(`/${conversationId}/messages`)
    .expect(200)
    .expect(messages)
})

test("sends 404 if conversation is not found", async () => {
  useCase.execute.mockResolvedValueOnce({
    ok: false,
    error: "Conversation not found",
  })

  await request(app)
    .get(`/${conversationId}/messages`)
    .expect(404)
})

test("sends 403 if user is not a participant", async () => {
  useCase.execute.mockResolvedValueOnce({
    ok: false,
    error: "Forbidden",
  })

  await request(app)
    .get(`/${conversationId}/messages`)
    .expect(403)
})
