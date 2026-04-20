export class Message {
  readonly id: string
  readonly senderId: string
  readonly content: string | URL
  readonly createdAt: Date
  readonly isRead: boolean

  private constructor(
    id: string,
    senderId: string,
    content: string | URL,
    createdAt: Date,
    isRead: boolean
  ) {
    this.id = id
    this.senderId = senderId
    this.content = content
    this.createdAt = createdAt
    this.isRead = isRead
  }

  static create(data: {
    id: string
    senderId: string
    content: string | URL
    createdAt: Date
    isRead: boolean
  }) {
    return new Message(data.id, data.senderId, data.content, data.createdAt, data.isRead)
  }

  get preview(): string {
    if (this.content instanceof URL) {
      return "Attachment"
    }

    return this.content
  }

  get isAttachment(): boolean {
    return this.content instanceof URL
  }
}
