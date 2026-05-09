import { MessageDate } from "./message-date"

export type MessageProps = {
  id: string
  senderId: string
  createdAt: Date | string
  text?: string | null
  attachmentURL?: string | null
}

export class Message {
  private constructor(
    readonly id: string,
    readonly senderId: string,
    readonly sentAt: MessageDate,
    readonly text: string | null,
    readonly attachmentUrl: string | null
  ) {}

  static create(data: MessageProps): Message {
    if (!data.text && !data.attachmentURL) {
      throw new Error("A message must have either text or an attachment")
    }

    return new Message(
      data.id,
      data.senderId,
      new MessageDate(data.createdAt),
      data.text ?? null,
      data.attachmentURL ?? null
    )
  }

  get isOnlyAttachment(): boolean {
    return this.attachmentUrl !== null && this.text === null
  }
}
