import type { ChatMember } from "./chat-member"
import type { Message } from "./message"
import { MessageDate } from "./message-date"

export class Chat {
  readonly id: string
  #peer: ChatMember
  readonly lastMessage: Message

  private constructor(id: string, peer: ChatMember, lastMessage: Message) {
    this.id = id
    this.#peer = peer
    this.lastMessage = lastMessage
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

  get time(): MessageDate {
    return this.lastMessage.createdAt
  }
}

export type ChatData = {
  id: string
  peerId: string
}
