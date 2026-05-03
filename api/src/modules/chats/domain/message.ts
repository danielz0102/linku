export type Message = {
  id: string
  senderId: string
  text: string | null
  attachmentUrl: string | null
  createdAt: string
  isRead: boolean
}
