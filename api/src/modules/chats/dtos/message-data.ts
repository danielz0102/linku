type MessageContent =
  | {
      text: string
      attachmentUrl: string | null
    }
  | {
      text: string | null
      attachmentUrl: string
    }

export type MessageData = {
  id: string
  senderId: string
  createdAt: string
} & MessageContent

export function assertMessageContent(
  message: { text: string | null; attachmentUrl: string | null }
): asserts message is MessageContent {
  if (message.text === null && message.attachmentUrl === null) {
    throw new Error("Message must have either text or attachmentUrl")
  }
}
