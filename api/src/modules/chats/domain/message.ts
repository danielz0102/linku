export type Message = {
  id: string
  senderId: string
  content: string | null
  attachmentUrl: string | null
  createdAt: string
  isRead: boolean
}
