export class Message {
  readonly id: string
  readonly senderId: string
  readonly content: string | null
  readonly attachmentUrl?: URL
  readonly createdAt: Date
  readonly isRead: boolean

  private constructor(
    id: string,
    senderId: string,
    content: string | null,
    createdAt: Date,
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
      new Date(data.createdAt),
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
