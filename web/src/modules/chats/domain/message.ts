export class Message {
  readonly id: string
  readonly content: string | URL
  readonly createdAt: Date
  readonly isRead: boolean

  private constructor(id: string, content: string | URL, createdAt: Date, isRead: boolean) {
    this.id = id
    this.content = content
    this.createdAt = createdAt
    this.isRead = isRead
  }

  static create(data: { id: string; content: string | URL; createdAt: Date; isRead: boolean }) {
    return new Message(data.id, data.content, data.createdAt, data.isRead)
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
