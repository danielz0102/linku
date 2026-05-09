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
  #chatId: string | null

  private constructor(
    readonly id: string,
    readonly senderId: string,
    readonly text: string | null,
    readonly createdAt: Date,
    attachmentUrl: URL | null,
    chatId: string | null
  ) {
    this.#attachmentUrl = attachmentUrl
    this.#chatId = chatId
  }

  static create(props: MessageProps) {
    if (!props.text?.trim() && !props.attachmentUrl) {
      throw new Error("A message must have either text or an attachment")
    }

    return new Message(
      props.id ?? randomUUID(),
      props.senderId,
      props.text ?? null,
      props.createdAt ? new Date(props.createdAt) : new Date(),
      props.attachmentUrl ? new URL(props.attachmentUrl) : null,
      props.chatId ?? null
    )
  }

  get attachmentUrl() {
    return this.#attachmentUrl ? this.#attachmentUrl.href : null
  }

  get chatId() {
    return this.#chatId
  }

  set chatId(value: string | null) {
    this.#chatId = value
  }
}
