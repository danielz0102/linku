export namespace ChatAPI {
  export type ChatMember = {
    id: string
    username: string
    name: string
    profilePictureUrl: string | null
  }

  export type Message = {
    id: string
    senderId: string
    content: string | null
    attachmentUrl: string | null
    createdAt: string
    isRead: boolean
  }
}
