import { ChatDate } from "./chat-date"
import type { ChatMember } from "./chat-member"
import type { Message } from "./message"

export class Chat {
  readonly id: string
  #sender: ChatMember
  #lastMessage: Message
  #time: ChatDate

  private constructor(id: string, sender: ChatMember, lastMessage: Message) {
    this.id = id
    this.#sender = sender
    this.#lastMessage = lastMessage
    this.#time = new ChatDate(lastMessage.createdAt)
  }

  static create(data: { id: string; sender: ChatMember; lastMessage: Message }) {
    return new Chat(data.id, data.sender, data.lastMessage)
  }

  get initials(): string {
    return this.#sender.initials
  }

  get imageUrl(): string | undefined {
    return this.#sender.profilePictureUrl ?? undefined
  }

  get name(): string {
    return this.#sender.name
  }

  get lastMessage(): Message {
    return this.#lastMessage
  }

  get time(): ChatDate {
    return this.#time
  }
}
