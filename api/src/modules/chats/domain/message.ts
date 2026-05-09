import { randomUUID } from "node:crypto"

export type MessageProps = {
  id?: string
  chatId?: string | null
  senderId: string
  text?: string | null
  attachmentUrl?: string | URL | null
  createdAt?: Date | string | null
}

export class Message {
  #attachmentUrl: URL | null

  private constructor(
    readonly id: string,
    readonly chatId: string | null,
    readonly senderId: string,
    readonly text: string | null,
    attachmentUrl: URL | null,
    readonly createdAt: Date
  ) {
    this.#attachmentUrl = attachmentUrl
  }

  static create(props: MessageProps) {
    if (!props.text?.trim() && !props.attachmentUrl) {
      throw new Error("A message must have either text or an attachment")
    }

    return new Message(
      props.id ?? randomUUID(),
      props.chatId ?? null,
      props.senderId,
      props.text ?? null,
      props.attachmentUrl ? new URL(props.attachmentUrl) : null,
      props.createdAt ? new Date(props.createdAt) : new Date()
    )
  }

  get attachmentUrl() {
    return this.#attachmentUrl ? this.#attachmentUrl.href : null
  }
}
