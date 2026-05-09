import { Message, type MessageProps } from "#modules/chats/domain/message.ts"

describe("Message", () => {
  it.each([
    { label: "text is undefined", text: undefined, attachmentUrl: null },
    { label: "text is null", text: null, attachmentUrl: undefined },
    { label: "text is empty", text: "", attachmentUrl: null },
    { label: "text is whitespace", text: "   ", attachmentUrl: null },
  ])("throws when $label and no attachment is provided", ({ text, attachmentUrl }) => {
    const baseProps: MessageProps = {
      id: "message-1",
      chatId: null,
      senderId: "user-1",
      text: "Hello",
      attachmentUrl: null,
      createdAt: new Date(),
    }

    expect(() =>
      Message.create({
        ...baseProps,
        text,
        attachmentUrl,
      })
    ).toThrow("A message must have either text or an attachment")
  })
})
