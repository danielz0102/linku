import { ChatDate } from "./chat-date"
import type { ChatMember } from "./chat-member"
import type { Message } from "./message"

export class Chat {
  readonly id: string
  #peer: ChatMember
  readonly lastMessage: Message
  readonly time: ChatDate

  private constructor(id: string, peer: ChatMember, lastMessage: Message) {
    this.id = id
    this.#peer = peer
    this.lastMessage = lastMessage
    this.time = new ChatDate(lastMessage.createdAt)
  }

  static create(data: { id: string; peer: ChatMember; lastMessage: Message }) {
    return new Chat(data.id, data.peer, data.lastMessage)
  }

  get initials(): string {
    return this.#peer.initials
  }

  get imageUrl(): string | undefined {
    return this.#peer.profilePictureUrl ?? undefined
  }

  get name(): string {
    return this.#peer.name
  }

  get member(): ChatMember {
    return this.#peer
  }
}
