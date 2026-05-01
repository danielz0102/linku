import { MessageDate } from "./message-date"

export class Message {
  readonly id: string
  readonly senderId: string
  readonly content: string | null
  readonly attachmentUrl?: URL
  readonly createdAt: MessageDate
  readonly isRead: boolean

  private constructor(
    id: string,
    senderId: string,
    content: string | null,
    createdAt: MessageDate,
    isRead: boolean,
    attachmentUrl?: URL
  ) {
    this.id = id
    this.senderId = senderId
    this.content = content
    this.createdAt = createdAt
    this.isRead = isRead
    this.attachmentUrl = attachmentUrl
  }

  static create(data: {
    id: string
    senderId: string
    content: string | null
    createdAt: string
    isRead: boolean
    attachmentUrl?: string
  }) {
    if (!data.content && !data.attachmentUrl) {
      throw new Error("Message must have either content or an attachment")
    }

    return new Message(
      data.id,
      data.senderId,
      data.content,
      new MessageDate(data.createdAt),
      data.isRead,
      data.attachmentUrl ? new URL(data.attachmentUrl) : undefined
    )
  }

  get preview(): string {
    if (this.content) {
      return this.content
    }

    return "Attachment"
  }
}

export type MessageData = {
  id: string
  senderId: string
  isRead: boolean
  createdAt: Date
} & MessageContent

type MessageContent =
  | {
      type: "text-only"
      text: string
      attachmentUrl?: never
    }
  | {
      type: "attachment-only"
      text?: never
      attachmentUrl: string
    }
  | {
      type: "text-and-attachment"
      text: string
      attachmentUrl: string
    }

export function getMessagePreview(message: MessageData): string {
  if (message.text) {
    return message.text
  }

  return "Attachment"
}
